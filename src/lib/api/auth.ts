import { apiRequest, API_URL, getAuthHeaders } from '@/config/api';
import { User, UserRole } from '../auth';

/**
 * Servicio de Autenticación que se conecta a MySQL via API
 */

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  minecraft_username?: string;
}

export const AuthAPI = {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Guardar token
    localStorage.setItem('darksow_token', response.token);
    localStorage.setItem('darksow_user', JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar token y usuario
    localStorage.setItem('darksow_token', response.token);
    localStorage.setItem('darksow_user', JSON.stringify(response.user));
    
    return response;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('darksow_token');
      localStorage.removeItem('darksow_user');
    }
  },

  /**
   * Obtener usuario actual desde el servidor
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiRequest('/auth/me');
      localStorage.setItem('darksow_user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  /**
   * Obtener usuario desde localStorage (cache)
   */
  getCurrentUserFromCache(): User | null {
    const userData = localStorage.getItem('darksow_user');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const user = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    localStorage.setItem('darksow_user', JSON.stringify(user));
    return user;
  },

  /**
   * Subir avatar
   */
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${API_URL}/auth/upload-avatar`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Error al subir avatar');
    }
    
    return response.json();
  },

  /**
   * Verificar permisos
   */
  hasPermission(requiredRole: UserRole): boolean {
    const user = this.getCurrentUserFromCache();
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      usuario: 1,
      vip: 2,
      moderador: 3,
      admin: 4,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  /**
   * Obtener todos los usuarios (solo Admin)
   */
  async getAllUsers(): Promise<User[]> {
    return apiRequest('/users');
  },

  /**
   * Cambiar rol de usuario (solo Super Admin)
   */
  async updateUserRole(userId: string, roleId: number): Promise<User> {
    return apiRequest(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role_id: roleId }),
    });
  },
};
