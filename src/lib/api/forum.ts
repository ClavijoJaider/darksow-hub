import { apiRequest } from '@/config/api';
import { ForumCategory, ForumPost, ForumComment } from '../forum';
import { User } from '../auth';

/**
 * Servicio del Foro que se conecta a MySQL via API
 */

export const ForumAPI = {
  // ============ CATEGORÍAS ============
  
  async getCategories(): Promise<ForumCategory[]> {
    return apiRequest('/forum/categories');
  },

  async getCategory(categoryId: string): Promise<ForumCategory> {
    return apiRequest(`/forum/categories/${categoryId}`);
  },

  async createCategory(data: {
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_id?: number;
  }): Promise<ForumCategory> {
    return apiRequest('/forum/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(categoryId: string): Promise<void> {
    await apiRequest(`/forum/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },

  // ============ POSTS ============
  
  async getPosts(params?: {
    category_id?: string;
    search?: string;
    sort?: 'recent' | 'popular' | 'views';
  }): Promise<ForumPost[]> {
    const queryParams = new URLSearchParams();
    if (params?.category_id) queryParams.append('category_id', params.category_id);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    return apiRequest(`/forum/posts${query ? '?' + query : ''}`);
  },

  async getPost(postId: string): Promise<ForumPost> {
    return apiRequest(`/forum/posts/${postId}`);
  },

  async createPost(data: {
    title: string;
    content: string;
    category_id: number;
    images?: string[];
  }): Promise<ForumPost> {
    return apiRequest('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePost(postId: string, data: {
    title: string;
    content: string;
  }): Promise<ForumPost> {
    return apiRequest(`/forum/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePost(postId: string): Promise<void> {
    await apiRequest(`/forum/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  async togglePinPost(postId: string): Promise<ForumPost> {
    return apiRequest(`/forum/posts/${postId}/pin`, {
      method: 'POST',
    });
  },

  async toggleLockPost(postId: string): Promise<ForumPost> {
    return apiRequest(`/forum/posts/${postId}/lock`, {
      method: 'POST',
    });
  },

  async incrementViews(postId: string): Promise<void> {
    await apiRequest(`/forum/posts/${postId}/view`, {
      method: 'POST',
    });
  },

  async togglePostReaction(postId: string, reactionType: 'like' | 'love' | 'fire'): Promise<void> {
    await apiRequest(`/forum/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reaction_type: reactionType }),
    });
  },

  // ============ COMENTARIOS ============
  
  async getComments(postId: string): Promise<ForumComment[]> {
    return apiRequest(`/forum/posts/${postId}/comments`);
  },

  async createComment(postId: string, content: string): Promise<ForumComment> {
    return apiRequest(`/forum/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async updateComment(commentId: string, content: string): Promise<ForumComment> {
    return apiRequest(`/forum/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  async deleteComment(commentId: string): Promise<void> {
    await apiRequest(`/forum/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  async toggleCommentReaction(commentId: string, reactionType: 'like' | 'love'): Promise<void> {
    await apiRequest(`/forum/comments/${commentId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reaction_type: reactionType }),
    });
  },
};
