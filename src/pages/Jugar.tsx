import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Jugar = () => {
  const gameModes = [
    {
      name: "Skyblock",
      description: "Comienza en una isla flotante y construye tu imperio",
      players: 142,
      icon: Star,
      color: "primary",
      features: [
        "Sistema de islas personalizable",
        "Economía y comercio",
        "Misiones y desafíos",
        "Dungeons y jefes",
      ],
    },
    {
      name: "Majestic Mods",
      description: "Minecraft con mods épicos y tecnología avanzada",
      players: 47,
      icon: Zap,
      color: "secondary",
      features: [
        "Más de 200 mods",
        "Dimensiones únicas",
        "Magia y tecnología",
        "PvE cooperativo",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Modos de Juego
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige tu aventura y únete a miles de jugadores en Darksow Network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.name}
                className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 ${
                          mode.color === "primary"
                            ? "bg-gradient-primary shadow-glow"
                            : "bg-gradient-gold shadow-gold-glow"
                        } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-7 h-7 text-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {mode.name}
                        </h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {mode.players} jugadores
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{mode.description}</p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Características:
                    </p>
                    <ul className="space-y-1">
                      {mode.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full ${
                      mode.color === "primary"
                        ? "bg-gradient-primary shadow-glow"
                        : "bg-gradient-gold shadow-gold-glow"
                    } hover:shadow-gold-glow transition-all`}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Jugar {mode.name}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-border">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              ¿Cómo conectarse?
            </h3>
            <ol className="text-left space-y-3 max-w-2xl mx-auto">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span className="text-muted-foreground">
                  Abre Minecraft y ve a Multijugador
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span className="text-muted-foreground">
                  Haz clic en "Añadir servidor"
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span className="text-muted-foreground">
                  Ingresa la IP:{" "}
                  <code className="px-2 py-1 bg-card rounded text-primary font-mono">
                    darksow.net
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span className="text-muted-foreground">
                  ¡Conéctate y disfruta!
                </span>
              </li>
            </ol>
            <div className="pt-4">
              <Link to="/">
                <Button variant="outline" className="border-primary text-primary">
                  Ver más información
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Jugar;
