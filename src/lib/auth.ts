export type UserRole = 'usuario' | 'vip' | 'moderador' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  minecraft_username?: string;
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
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  getAllUsers(): User[] {
    const usersData = localStorage.getItem('darksow_users');
    return usersData ? JSON.parse(usersData) : [];
  },

  initializeDefaultUsers(): void {
    const users = this.getAllUsers();
    
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'Admin',
          email: 'admin@darksow.net',
          role: 'admin',
          minecraft_username: 'DarksowAdmin',
          created_at: new Date().toISOString(),
          stats: { level: 100, coins: 999999, karma: 10000 },
        },
        {
          id: '2',
          username: 'Moderador',
          email: 'mod@darksow.net',
          role: 'moderador',
          minecraft_username: 'DarksowMod',
          created_at: new Date().toISOString(),
          stats: { level: 50, coins: 50000, karma: 5000 },
        },
      ];
      
      localStorage.setItem('darksow_users', JSON.stringify(defaultUsers));
    }
  },
};
