import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Zap, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsService } from "@/lib/news";
import { AuthService } from "@/lib/auth";
import { useState, useEffect } from "react";

const Index = () => {
  const [news, setNews] = useState(NewsService.getNews());
  const user = AuthService.getCurrentUser();
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

  useEffect(() => {
    const interval = setInterval(() => {
      setNews(NewsService.getNews());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const gameStats = [
    { label: "Jugadores Online", value: "2,847", icon: Users },
    { label: "Modos de Juego", value: "2", icon: Gamepad2 },
    { label: "Eventos Activos", value: "5", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                DARKSOW
              </span>
              <br />
              <span className="text-foreground">Network</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              La mejor experiencia de Minecraft con SkyBlock y Majestic Mods
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary shadow-glow text-lg px-8"
              >
                <Gamepad2 className="mr-2" />
                Conectar: darksow.net
              </Button>
              <Link to="/tienda">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver Tienda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gameStats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 bg-card border-border hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Noticias y Anuncios
            </h2>
            <p className="text-muted-foreground">
              Mantente al día con las últimas actualizaciones
            </p>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline">Gestionar Noticias</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.length > 0 ? (
            news.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden bg-card border-border hover:shadow-glow transition-all cursor-pointer group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-primary rounded-full text-xs font-bold text-primary-foreground">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.published_at).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {article.author_name}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <p className="text-foreground">
                    {article.content}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-2 p-12 text-center bg-card border-border">
              <p className="text-muted-foreground">
                No hay noticias publicadas aún
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-4xl font-bold text-center text-foreground mb-12">
          Modos de Juego
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden bg-card border-border hover:shadow-glow transition-all group">
            <div className="relative h-64">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"
                alt="SkyBlock"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                SkyBlock
              </h3>
              <p className="text-muted-foreground mb-6">
                Comienza en una isla flotante y construye tu imperio. Farming,
                trading, y minions te esperan.
              </p>
              <Button className="bg-gradient-primary shadow-glow">
                Explorar SkyBlock
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border hover:shadow-glow transition-all group">
            <div className="relative h-64">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
                alt="Majestic Mods"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Majestic Mods
              </h3>
              <p className="text-muted-foreground mb-6">
                Experiencia modded única con tecnología avanzada y magia. Crea
                tu propia aventura.
              </p>
              <Button className="bg-gradient-primary shadow-glow">
                Explorar Mods
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
