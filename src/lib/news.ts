export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author_id: string;
  author_name: string;
  published_at: string;
  created_at: string;
}

const STORAGE_KEY = 'darksow_news';

export const NewsService = {
  getNews(): NewsArticle[] {
    const newsData = localStorage.getItem(STORAGE_KEY);
    return newsData ? JSON.parse(newsData) : [];
  },

  getArticle(id: string): NewsArticle | null {
    const news = this.getNews();
    return news.find(article => article.id === id) || null;
  },

  createArticle(
    title: string,
    excerpt: string,
    content: string,
    cover_image: string,
    category: string,
    author_id: string,
    author_name: string
  ): NewsArticle {
    const news = this.getNews();
    
    const newArticle: NewsArticle = {
      id: crypto.randomUUID(),
      title,
      excerpt,
      content,
      cover_image,
      category,
      author_id,
      author_name,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    
    news.unshift(newArticle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
    
    return newArticle;
  },

  updateArticle(id: string, updates: Partial<NewsArticle>): void {
    const news = this.getNews();
    const index = news.findIndex(article => article.id === id);
    
    if (index !== -1) {
      news[index] = { ...news[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
    }
  },

  deleteArticle(id: string): void {
    const news = this.getNews();
    const filtered = news.filter(article => article.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  initializeDefaultNews(): void {
    const news = this.getNews();
    
    if (news.length === 0) {
      const defaultNews: NewsArticle[] = [
        {
          id: '1',
          title: 'Bienvenidos a DarkSow Network',
          excerpt: 'Comenzamos una nueva era en el servidor con increíbles actualizaciones.',
          content: 'Estamos emocionados de anunciar el lanzamiento oficial de DarkSow Network. Con dos modos de juego únicos: SkyBlock y Majestic Mods, ofrecemos una experiencia de Minecraft sin igual.',
          cover_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop',
          category: 'Anuncios',
          author_id: '1',
          author_name: 'SuperAdmin',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNews));
    }
  },
};

// Inicializar noticias por defecto
NewsService.initializeDefaultNews();
