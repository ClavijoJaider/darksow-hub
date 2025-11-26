# Configuración de MySQL Backend - Guía Completa

## 📋 Paso 1: Crear Base de Datos MySQL

### 1.1 Crear la Base de Datos
```sql
CREATE DATABASE darksow_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE darksow_network;
```

### 1.2 Tabla de Roles
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    hierarchy_level INT NOT NULL,
    INDEX idx_hierarchy (hierarchy_level)
) ENGINE=InnoDB;

-- Insertar roles predeterminados
INSERT INTO roles (id, name, hierarchy_level) VALUES
(1, 'Usuario', 1),
(2, 'Admin', 2),
(3, 'Super Admin', 3);
```

### 1.3 Tabla de Usuarios
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 1,
    minecraft_username VARCHAR(50) NULL,
    avatar TEXT NULL,
    profile_description TEXT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role_id)
) ENGINE=InnoDB;
```

### 1.4 Tabla de Estadísticas de Usuario
```sql
CREATE TABLE user_stats (
    user_id INT PRIMARY KEY,
    level INT DEFAULT 1,
    coins INT DEFAULT 0,
    karma INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 1.5 Tabla de Categorías del Foro
```sql
CREATE TABLE forum_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    parent_id INT NULL,
    display_order INT DEFAULT 0,
    is_private BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id),
    INDEX idx_order (display_order)
) ENGINE=InnoDB;
```

### 1.6 Tabla de Posts del Foro
```sql
CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    is_pinned BOOLEAN DEFAULT 0,
    is_locked BOOLEAN DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_author (author_id),
    INDEX idx_pinned (is_pinned),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;
```

### 1.7 Tabla de Imágenes de Posts
```sql
CREATE TABLE post_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    INDEX idx_post (post_id)
) ENGINE=InnoDB;
```

### 1.8 Tabla de Comentarios
```sql
CREATE TABLE forum_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_author (author_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;
```

### 1.9 Tabla de Reacciones a Posts
```sql
CREATE TABLE post_reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('like', 'love', 'fire') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post_reaction (post_id, user_id, reaction_type),
    INDEX idx_post (post_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;
```

### 1.10 Tabla de Reacciones a Comentarios
```sql
CREATE TABLE comment_reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('like', 'love') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_comment_reaction (comment_id, user_id, reaction_type),
    INDEX idx_comment (comment_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;
```

### 1.11 Tabla de Noticias
```sql
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category VARCHAR(50),
    author_id INT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_published (published_at),
    INDEX idx_category (category)
) ENGINE=InnoDB;
```

### 1.12 Limpiar Cuentas Demo
```sql
-- Eliminar cuentas demo
DELETE FROM users WHERE is_demo = 1;
```

---

## 🔧 Paso 2: Crear Backend API (Node.js/Express Ejemplo)

### 2.1 Instalar Dependencias
```bash
npm init -y
npm install express mysql2 bcrypt jsonwebtoken cors dotenv
```

### 2.2 Estructura de Carpetas Sugerida
```
backend/
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── forum.js
│   └── news.js
├── middleware/
│   └── auth.js
├── .env
└── server.js
```

### 2.3 Archivo .env
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=darksow_network
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

---

## 📡 Paso 3: Endpoints Requeridos

### 3.1 Autenticación (/api/auth)
```
POST   /api/auth/register          - Registro de usuario
POST   /api/auth/login             - Inicio de sesión
POST   /api/auth/logout            - Cerrar sesión
GET    /api/auth/me                - Obtener usuario actual
PUT    /api/auth/profile           - Actualizar perfil
POST   /api/auth/upload-avatar     - Subir avatar
```

### 3.2 Usuarios (/api/users)
```
GET    /api/users                  - Listar todos los usuarios (Admin)
GET    /api/users/:id              - Obtener usuario por ID
PUT    /api/users/:id/role         - Cambiar rol (Super Admin)
DELETE /api/users/:id              - Eliminar usuario (Super Admin)
```

### 3.3 Categorías del Foro (/api/forum/categories)
```
GET    /api/forum/categories       - Listar categorías
GET    /api/forum/categories/:id   - Obtener categoría específica
POST   /api/forum/categories       - Crear categoría (Admin)
PUT    /api/forum/categories/:id   - Actualizar categoría (Admin)
DELETE /api/forum/categories/:id   - Eliminar categoría (Admin)
```

### 3.4 Posts del Foro (/api/forum/posts)
```
GET    /api/forum/posts            - Listar posts (con filtros: category, search, sort)
GET    /api/forum/posts/:id        - Obtener post específico
POST   /api/forum/posts            - Crear post
PUT    /api/forum/posts/:id        - Actualizar post
DELETE /api/forum/posts/:id        - Eliminar post
POST   /api/forum/posts/:id/pin    - Pin/Unpin post (Moderador)
POST   /api/forum/posts/:id/lock   - Lock/Unlock post (Moderador)
POST   /api/forum/posts/:id/view   - Incrementar vistas
POST   /api/forum/posts/:id/react  - Reaccionar a post
```

### 3.5 Comentarios (/api/forum/comments)
```
GET    /api/forum/posts/:postId/comments  - Listar comentarios de un post
POST   /api/forum/posts/:postId/comments  - Crear comentario
PUT    /api/forum/comments/:id            - Actualizar comentario
DELETE /api/forum/comments/:id            - Eliminar comentario
POST   /api/forum/comments/:id/react      - Reaccionar a comentario
```

### 3.6 Noticias (/api/news)
```
GET    /api/news                   - Listar noticias
GET    /api/news/:id               - Obtener noticia específica
POST   /api/news                   - Crear noticia (Admin)
PUT    /api/news/:id               - Actualizar noticia (Admin)
DELETE /api/news/:id               - Eliminar noticia (Admin)
```

---

## 🔐 Paso 4: Seguridad y CORS

### 4.1 Configurar CORS en tu Backend
```javascript
// server.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend Lovable
  credentials: true
}));
```

### 4.2 Middleware de Autenticación JWT
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
```

---

## ⚙️ Paso 5: Configurar Frontend

### 5.1 Actualizar `src/config/api.ts`
```typescript
export const API_URL = 'http://localhost:3001/api';
// Cuando despliegues, cambia a: export const API_URL = 'https://tu-backend.com/api';
```

### 5.2 El frontend ya está preparado para usar estos endpoints
Los archivos `src/lib/api/auth.ts`, `src/lib/api/forum.ts`, etc. ya están configurados para consumir tu API.

---

## 🚀 Paso 6: Iniciar Todo

### 6.1 Iniciar tu Backend
```bash
cd backend
node server.js
# Debería mostrar: "Server running on port 3001"
```

### 6.2 Iniciar Lovable (ya está corriendo)
El frontend de Lovable ya está corriendo y listo para conectarse.

### 6.3 Probar la Conexión
1. Abre la aplicación en Lovable
2. Intenta registrarte con un nuevo usuario
3. Si funciona, ¡la conexión está lista!

---

## 📝 Notas Importantes

1. **JWT Secret**: Cambia `JWT_SECRET` en `.env` por algo seguro y aleatorio
2. **Passwords**: Los passwords deben hashearse con bcrypt (strength 10+)
3. **CORS**: Actualiza `CORS_ORIGIN` cuando despliegues a producción
4. **Rate Limiting**: Considera agregar rate limiting en producción
5. **SSL**: En producción, usa HTTPS siempre
6. **Validación**: Valida todas las entradas del usuario en el backend
7. **Uploads**: Para avatares e imágenes, necesitarás configurar multer o similar

---

## 🐛 Troubleshooting

### Error de Conexión a MySQL
- Verifica que MySQL esté corriendo
- Confirma credenciales en `.env`
- Verifica que la base de datos exista

### CORS Error
- Verifica que `CORS_ORIGIN` coincida con la URL de Lovable
- Asegúrate de que el backend esté corriendo

### JWT Token Error
- Verifica que `JWT_SECRET` esté configurado
- Confirma que el token se esté enviando en headers

---

## 📚 Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [JWT Best Practices](https://jwt.io/introduction)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

**¿Necesitas ayuda?** Estos son los pasos completos. Una vez que tengas tu backend MySQL corriendo, el frontend se conectará automáticamente.
