import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MessageSquare, Pin, Lock, Eye, ThumbsUp, Heart, Flame } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { ForumService, ForumCategory, ForumPost } from "@/lib/forum";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Foro = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCategories(ForumService.getCategories());
    setPosts(ForumService.getPosts());
  };

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category_id === selectedCategory)
    : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getCategoryStats = (categoryId: string) => {
    const categoryPosts = posts.filter((p) => p.category_id === categoryId);
    return {
      topics: categoryPosts.length,
      posts: categoryPosts.reduce((sum, p) => sum + ForumService.getPostComments(p.id).length, 0),
    };
  };

  const getTotalReactions = (post: ForumPost) => {
    return post.reactions.like.length + post.reactions.love.length + post.reactions.fire.length;
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Foro
          </h1>
          <p className="text-lg text-muted-foreground">
            Comunidad y discusiones
          </p>
          {user ? (
            <CreatePostDialog user={user} categories={categories} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Inicia sesión para crear temas
            </p>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Categorías</h2>
            <div className="grid gap-2">
              {categories.map((category) => {
                const stats = getCategoryStats(category.id);
                const Icon = category.icon === 'Pin' ? Pin : category.icon === 'Lock' ? Lock : MessageSquare;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Card
                    key={category.id}
                    className={`p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow cursor-pointer ${
                      isSelected ? 'border-primary shadow-glow' : ''
                    }`}
                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right hidden sm:block">
                        <p className="text-sm font-semibold text-foreground">
                          {stats.topics} temas
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats.posts} mensajes
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedCategory ? `Temas en ${categories.find(c => c.id === selectedCategory)?.name}` : 'Todos los Temas'}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </button>
              )}
            </div>
            
            {sortedPosts.length === 0 ? (
              <Card className="p-8 border-border text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No hay temas en esta categoría. ¡Sé el primero en crear uno!
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {sortedPosts.map((post) => {
                  const commentCount = ForumService.getPostComments(post.id).length;
                  const totalReactions = getTotalReactions(post);
                  
                  return (
                    <Card
                      key={post.id}
                      className="p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow cursor-pointer"
                      onClick={() => navigate(`/foro/post/${post.id}`)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          {post.pinned && (
                            <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          )}
                          {post.locked && (
                            <Lock className="w-4 h-4 text-destructive flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span>Por {post.author_username}</span>
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                                {post.category_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {commentCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </span>
                              {totalReactions > 0 && (
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {totalReactions}
                                </span>
                              )}
                              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foro;
