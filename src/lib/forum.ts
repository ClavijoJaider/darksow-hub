import { User } from './auth';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  images?: string[];
  author_id: string;
  author_username: string;
  author_avatar?: string;
  author_role: string;
  category_id: string;
  category_name: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  locked: boolean;
  views: number;
  reactions: {
    like: string[]; // user IDs
    love: string[];
    fire: string[];
  };
}

export interface ForumComment {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  author_avatar?: string;
  author_role: string;
  content: string;
  created_at: string;
  updated_at: string;
  reactions: {
    like: string[];
    love: string[];
  };
}

const CATEGORIES_KEY = 'darksow_forum_categories';
const POSTS_KEY = 'darksow_forum_posts';
const COMMENTS_KEY = 'darksow_forum_comments';

export const ForumService = {
  // Categories
  getCategories(): ForumCategory[] {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : this.getDefaultCategories();
  },

  getDefaultCategories(): ForumCategory[] {
    const defaults: ForumCategory[] = [
      {
        id: '1',
        name: 'Anuncios',
        description: 'Noticias oficiales del servidor',
        icon: 'Pin',
        color: 'primary',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'General',
        description: 'Discusión general sobre Darksow',
        icon: 'MessageSquare',
        color: 'muted',
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Skyblock',
        description: 'Todo sobre el modo Skyblock',
        icon: 'MessageSquare',
        color: 'muted',
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Majestic Mods',
        description: 'Discusión sobre Majestic Mods',
        icon: 'MessageSquare',
        color: 'muted',
        created_at: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Reportes',
        description: 'Reporta jugadores o bugs',
        icon: 'Lock',
        color: 'destructive',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults));
    return defaults;
  },

  createCategory(name: string, description: string, icon: string, color: string): ForumCategory {
    const categories = this.getCategories();
    const newCategory: ForumCategory = {
      id: crypto.randomUUID(),
      name,
      description,
      icon,
      color,
      created_at: new Date().toISOString(),
    };
    categories.push(newCategory);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
  },

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter(c => c.id !== categoryId);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  // Posts
  getPosts(): ForumPost[] {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPostsByCategory(categoryId: string): ForumPost[] {
    return this.getPosts().filter(p => p.category_id === categoryId);
  },

  getPost(postId: string): ForumPost | null {
    return this.getPosts().find(p => p.id === postId) || null;
  },

  createPost(title: string, content: string, categoryId: string, user: User, images?: string[]): ForumPost {
    const posts = this.getPosts();
    const category = this.getCategories().find(c => c.id === categoryId);
    
    const newPost: ForumPost = {
      id: crypto.randomUUID(),
      title,
      content,
      images,
      author_id: user.id,
      author_username: user.username,
      author_avatar: user.avatar,
      author_role: user.role,
      category_id: categoryId,
      category_name: category?.name || 'General',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pinned: false,
      locked: false,
      views: 0,
      reactions: {
        like: [],
        love: [],
        fire: [],
      },
    };
    
    posts.unshift(newPost);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return newPost;
  },

  updatePost(postId: string, title: string, content: string): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
      posts[index].updated_at = new Date().toISOString();
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  deletePost(postId: string): void {
    const posts = this.getPosts().filter(p => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    
    // Delete associated comments
    const comments = this.getComments().filter(c => c.post_id !== postId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  },

  togglePinPost(postId: string): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].pinned = !posts[index].pinned;
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  toggleLockPost(postId: string): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].locked = !posts[index].locked;
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  incrementViews(postId: string): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].views++;
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  togglePostReaction(postId: string, userId: string, reactionType: 'like' | 'love' | 'fire'): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const reactions = posts[index].reactions[reactionType];
      const userIndex = reactions.indexOf(userId);
      
      if (userIndex > -1) {
        reactions.splice(userIndex, 1);
      } else {
        reactions.push(userId);
      }
      
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  // Comments
  getComments(): ForumComment[] {
    const data = localStorage.getItem(COMMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPostComments(postId: string): ForumComment[] {
    return this.getComments().filter(c => c.post_id === postId);
  },

  createComment(postId: string, content: string, user: User): ForumComment {
    const comments = this.getComments();
    
    const newComment: ForumComment = {
      id: crypto.randomUUID(),
      post_id: postId,
      author_id: user.id,
      author_username: user.username,
      author_avatar: user.avatar,
      author_role: user.role,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: {
        like: [],
        love: [],
      },
    };
    
    comments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    return newComment;
  },

  updateComment(commentId: string, content: string): void {
    const comments = this.getComments();
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments[index].content = content;
      comments[index].updated_at = new Date().toISOString();
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }
  },

  deleteComment(commentId: string): void {
    const comments = this.getComments().filter(c => c.id !== commentId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  },

  toggleCommentReaction(commentId: string, userId: string, reactionType: 'like' | 'love'): void {
    const comments = this.getComments();
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      const reactions = comments[index].reactions[reactionType];
      const userIndex = reactions.indexOf(userId);
      
      if (userIndex > -1) {
        reactions.splice(userIndex, 1);
      } else {
        reactions.push(userId);
      }
      
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }
  },
};
