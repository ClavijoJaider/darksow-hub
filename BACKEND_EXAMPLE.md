# Ejemplo de Backend Node.js + Express + MySQL

Este es un ejemplo completo de cómo implementar el backend para DarkSow Network.

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── forum.js
│   └── news.js
├── .env
├── package.json
└── server.js
```

## 1. package.json

```json
{
  "name": "darksow-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 2. config/database.js

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

## 3. middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const requireRole = (minHierarchy) => {
  return (req, res, next) => {
    if (req.userRole < minHierarchy) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
```

## 4. routes/auth.js

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, minecraft_username } = req.body;
    
    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Insertar usuario
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, minecraft_username, role_id) VALUES (?, ?, ?, ?, 1)',
      [username, email, password_hash, minecraft_username || null]
    );
    
    const userId = result.insertId;
    
    // Crear stats
    await pool.execute(
      'INSERT INTO user_stats (user_id) VALUES (?)',
      [userId]
    );
    
    // Obtener usuario completo
    const [users] = await pool.execute(`
      SELECT u.*, r.name as role, r.hierarchy_level,
             s.level, s.coins, s.karma
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_stats s ON u.id = s.user_id
      WHERE u.id = ?
    `, [userId]);
    
    const user = users[0];
    
    // Generar token
    const token = jwt.sign(
      { userId: user.id, role: user.hierarchy_level },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.toLowerCase(),
        minecraft_username: user.minecraft_username,
        avatar: user.avatar,
        created_at: user.created_at,
        stats: {
          level: user.level,
          coins: user.coins,
          karma: user.karma
        }
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Usuario o email ya existe' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const [users] = await pool.execute(`
      SELECT u.*, r.name as role, r.hierarchy_level,
             s.level, s.coins, s.karma
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_stats s ON u.id = s.user_id
      WHERE u.email = ?
    `, [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    
    // Verificar password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { userId: user.id, role: user.hierarchy_level },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.toLowerCase(),
        minecraft_username: user.minecraft_username,
        avatar: user.avatar,
        created_at: user.created_at,
        stats: {
          level: user.level,
          coins: user.coins,
          karma: user.karma
        }
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Obtener usuario actual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT u.*, r.name as role, r.hierarchy_level,
             s.level, s.coins, s.karma
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_stats s ON u.id = s.user_id
      WHERE u.id = ?
    `, [req.userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const user = users[0];
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.toLowerCase(),
      minecraft_username: user.minecraft_username,
      avatar: user.avatar,
      created_at: user.created_at,
      stats: {
        level: user.level,
        coins: user.coins,
        karma: user.karma
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar perfil
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { minecraft_username, profile_description } = req.body;
    
    await pool.execute(
      'UPDATE users SET minecraft_username = ?, profile_description = ? WHERE id = ?',
      [minecraft_username, profile_description, req.userId]
    );
    
    // Devolver usuario actualizado
    const [users] = await pool.execute(`
      SELECT u.*, r.name as role, r.hierarchy_level,
             s.level, s.coins, s.karma
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_stats s ON u.id = s.user_id
      WHERE u.id = ?
    `, [req.userId]);
    
    const user = users[0];
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.toLowerCase(),
      minecraft_username: user.minecraft_username,
      avatar: user.avatar,
      profile_description: user.profile_description,
      created_at: user.created_at,
      stats: {
        level: user.level,
        coins: user.coins,
        karma: user.karma
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
```

## 5. server.js

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
// Importa más rutas aquí...

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// Agrega más rutas aquí...

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 6. .env

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=darksow_network
JWT_SECRET=tu_secreto_super_seguro_random_aqui_123456789
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

---

## Iniciar el Backend

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

---

## Notas Importantes

1. **Completa las rutas**: Este ejemplo solo incluye autenticación. Necesitas implementar las rutas de foro, noticias, usuarios, etc.

2. **Seguridad**:
   - Cambia `JWT_SECRET` por algo aleatorio y seguro
   - En producción, usa HTTPS
   - Implementa rate limiting
   - Valida todas las entradas

3. **Uploads**: Para avatares e imágenes, configura multer y un sistema de almacenamiento (disco, S3, etc.)

4. **Testing**: Prueba cada endpoint antes de conectar el frontend

---

Este es un punto de partida sólido. Adapta según tus necesidades específicas.
