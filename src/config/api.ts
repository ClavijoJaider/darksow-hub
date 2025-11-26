/**
 * API Configuration
 * 
 * IMPORTANTE: Cambia esta URL cuando tengas tu backend MySQL corriendo
 * Ejemplo local: http://localhost:3001/api
 * Ejemplo producción: https://api.darksow.net/api
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Helper para obtener el token de autenticación
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('darksow_token');
};

/**
 * Helper para configurar headers con autenticación
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper para manejar respuestas de la API
 */
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Helper para hacer peticiones autenticadas
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  return handleApiResponse(response);
};
