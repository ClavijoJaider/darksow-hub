import { storageEvents } from './storage-events';

export type UserRole = 'usuario' | 'vip' | 'moderador' | 'admin' | 'super_admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  minecraft_username?: string;
  avatar?: string;
  profile_description?: string;
  created_at: string;
  stats?: {
    level: number;
    coins: number;
    karma: number;
  };
}

const STORAGE_KEY = 'darksow_user';

export const AuthService = {
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  login(email: string, password: string): User | null {
    // Simulated login - in production this would validate against a backend
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      storageEvents.emit('users');
      return user;
    }
    
    return null;
  },

  register(username: string, email: string, password: string, minecraft_username?: string): User {
    const users = this.getAllUsers();
    
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      role: 'usuario',
      minecraft_username,
      created_at: new Date().toISOString(),
      stats: {
        level: 1,
        coins: 0,
        karma: 0,
      },
    };
    
    users.push(newUser);
    localStorage.setItem('darksow_users', JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    storageEvents.emit('users');
    
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  updateUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('darksow_users', JSON.stringify(users));
      storageEvents.emit('users');
    }
  },

  hasPermission(requiredRole: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      usuario: 1,
      vip: 2,
      moderador: 3,
      admin: 4,
      super_admin: 5,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },
  
  canManageRole(targetRole: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      usuario: 1,
      vip: 2,
      moderador: 3,
      admin: 4,
      super_admin: 5,
    };
    
    // Solo Super Admin puede gestionar Admins
    if (targetRole === 'admin') {
      return user.role === 'super_admin';
    }
    
    // Admins y Super Admins pueden gestionar roles inferiores
    return roleHierarchy[user.role] >= 4;
  },

  getAllUsers(): User[] {
    const usersData = localStorage.getItem('darksow_users');
    return usersData ? JSON.parse(usersData) : [];
  },

  initializeDefaultUsers(): void {
    const users = this.getAllUsers();
    
    // Eliminar todas las cuentas demo
    const nonDemoUsers = users.filter(user => user.id !== 'demo');
    
    if (nonDemoUsers.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'SuperAdmin',
          email: 'superadmin@darksow.net',
          role: 'super_admin',
          minecraft_username: 'DarksowSuper',
          created_at: new Date().toISOString(),
          stats: { level: 100, coins: 999999, karma: 10000 },
        },
      ];
      
      localStorage.setItem('darksow_users', JSON.stringify(defaultUsers));
    } else {
      // Solo guardar usuarios no-demo
      localStorage.setItem('darksow_users', JSON.stringify(nonDemoUsers));
    }
  },
};
