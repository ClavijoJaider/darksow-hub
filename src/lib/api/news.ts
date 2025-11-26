import { apiRequest } from '@/config/api';

/**
 * Servicio de Noticias que se conecta a MySQL via API
 */

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: string;
  author_id: number;
  author_name?: string;
  published_at: string;
  updated_at: string;
}

export const NewsAPI = {
  /**
   * Obtener todas las noticias
   */
  async getNews(): Promise<NewsArticle[]> {
    return apiRequest('/news');
  },

  /**
   * Obtener una noticia específica
   */
  async getNewsById(id: number): Promise<NewsArticle> {
    return apiRequest(`/news/${id}`);
  },

  /**
   * Crear noticia (solo Admin)
   */
  async createNews(data: {
    title: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    category: string;
  }): Promise<NewsArticle> {
    return apiRequest('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar noticia (solo Admin)
   */
  async updateNews(id: number, data: {
    title: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    category: string;
  }): Promise<NewsArticle> {
    return apiRequest(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar noticia (solo Admin)
   */
  async deleteNews(id: number): Promise<void> {
    await apiRequest(`/news/${id}`, {
      method: 'DELETE',
    });
  },
};
