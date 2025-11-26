import { Card } from "@/components/ui/card";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Wiki = () => {
  const wikiCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
      articles: [
        "Cómo unirse al servidor",
        "Reglas del servidor",
        "Comandos básicos",
      ],
    },
    {
      id: "skyblock",
      title: "SkyBlock",
      icon: "🏝️",
      articles: [
        "Guía de inicio SkyBlock",
        "Farming avanzado",
        "Minions y automatización",
      ],
    },
    {
      id: "majestic-mods",
      title: "Majestic Mods",
      icon: "⚡",
      articles: [
        "Lista de mods",
        "Instalación de modpack",
        "Mecánicas personalizadas",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Wiki
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Toda la información que necesitas sobre DarkSow Network
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar en la wiki..."
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wikiCategories.map((category) => (
            <Card
              key={category.id}
              className="p-6 hover:shadow-glow transition-all cursor-pointer bg-card border-border"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.articles.map((article, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    → {article}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wiki;
