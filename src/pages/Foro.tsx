import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pin, Lock, User } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Foro = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  const categories = [
    {
      name: "Anuncios",
      description: "Noticias oficiales del servidor",
      topics: 24,
      posts: 156,
      icon: Pin,
      color: "primary",
    },
    {
      name: "General",
      description: "Discusión general sobre Darksow",
      topics: 342,
      posts: 2847,
      icon: MessageSquare,
      color: "muted",
    },
    {
      name: "Skyblock",
      description: "Todo sobre el modo Skyblock",
      topics: 158,
      posts: 1243,
      icon: MessageSquare,
      color: "muted",
    },
    {
      name: "Majestic Mods",
      description: "Discusión sobre Majestic Mods",
      topics: 89,
      posts: 567,
      icon: MessageSquare,
      color: "muted",
    },
    {
      name: "Reportes",
      description: "Reporta jugadores o bugs",
      topics: 45,
      posts: 123,
      icon: Lock,
      color: "destructive",
    },
  ];

  const recentTopics = [
    {
      title: "¿Cómo conseguir más coins en Skyblock?",
      author: "Player123",
      replies: 15,
      views: 234,
      category: "Skyblock",
    },
    {
      title: "Ideas para la próxima actualización",
      author: "BuilderPro",
      replies: 28,
      views: 451,
      category: "General",
    },
    {
      title: "Guía de mods en Majestic Mods",
      author: "ModExpert",
      replies: 42,
      views: 876,
      category: "Majestic Mods",
      pinned: true,
    },
  ];

  const handleNewTopic = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un tema");
      navigate("/auth");
      return;
    }
    toast.success("Función de crear tema próximamente");
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
          <Button
            className="bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all"
            onClick={handleNewTopic}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Nuevo Tema
          </Button>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Categorías</h2>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.name}
                    className="p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow`}>
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
                          {category.topics} temas
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.posts} mensajes
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Topics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Temas Recientes
            </h2>
            <div className="space-y-2">
              {recentTopics.map((topic, index) => (
                <Card
                  key={index}
                  className="p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      {topic.pinned && (
                        <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {topic.author}
                          </span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                            {topic.category}
                          </span>
                          <span>{topic.replies} respuestas</span>
                          <span>{topic.views} vistas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foro;
