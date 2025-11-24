import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Activity, Gamepad2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    online: 247,
    registered: 15420,
    playing: 189,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        online: 200 + Math.floor(Math.random() * 100),
        registered: 15420 + Math.floor(Math.random() * 50),
        playing: 150 + Math.floor(Math.random() * 80),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText("darksow.net");
    setCopied(true);
    toast.success("IP copiada al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              DARKSOW NETWORK
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              El mejor servidor de Minecraft en español
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Card className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary transition-colors group cursor-pointer" onClick={copyIP}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">IP del Servidor</p>
                    <p className="text-lg font-bold text-primary">darksow.net</p>
                  </div>
                  {copied ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
              </Card>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/jugar">
                <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Comenzar a Jugar
                </Button>
              </Link>
              <Link to="/tienda">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                  Ver Tienda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-card to-muted border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.online}</p>
                  <p className="text-sm text-muted-foreground">Jugadores Online</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-card to-muted border-border hover:border-secondary transition-all duration-300 hover:shadow-gold-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Activity className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.registered.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-card to-muted border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.playing}</p>
                  <p className="text-sm text-muted-foreground">En Partida</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Modos de Juego
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Skyblock</h3>
                <p className="text-muted-foreground">
                  Comienza en una isla flotante y expande tu imperio. Completa misiones, comercia con otros jugadores y conviértete en el más poderoso.
                </p>
                <Link to="/jugar">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Jugar Skyblock
                  </Button>
                </Link>
              </div>
            </Card>
            <Card className="group overflow-hidden border-border hover:border-secondary transition-all duration-300 hover:shadow-gold-glow">
              <div className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Majestic Mods</h3>
                <p className="text-muted-foreground">
                  Experimenta Minecraft con mods épicos. Explora nuevas dimensiones, tecnología avanzada y magia en un mundo completamente modificado.
                </p>
                <Link to="/jugar">
                  <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10">
                    Jugar Majestic Mods
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            ¿Listo para la aventura?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Únete a miles de jugadores en Darksow Network y vive la mejor experiencia de Minecraft
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all">
              Crear Cuenta Gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
