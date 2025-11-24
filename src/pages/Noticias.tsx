import { Card } from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";

const Noticias = () => {
  const news = [
    {
      id: 1,
      title: "¡Nueva actualización de Skyblock!",
      date: "2024-01-15",
      category: "Skyblock",
      excerpt:
        "Nuevas islas, objetos y misiones disponibles. Explora el nuevo contenido y descubre recompensas épicas.",
      content:
        "La actualización más grande de Skyblock ha llegado. Nuevas islas flotantes, sistema de comercio mejorado, y más de 50 nuevos items.",
    },
    {
      id: 2,
      title: "Torneo PvP - Premios increíbles",
      date: "2024-01-12",
      category: "Eventos",
      excerpt:
        "Únete al torneo mensual de PvP y compite por premios exclusivos. ¡El ganador se lleva un rango VIP+ gratis!",
      content:
        "El torneo comenzará el próximo sábado a las 18:00. Registro abierto hasta el viernes.",
    },
    {
      id: 3,
      title: "Majestic Mods - Pack de mods actualizado",
      date: "2024-01-10",
      category: "Majestic Mods",
      excerpt:
        "Hemos actualizado el pack de mods con mejoras de rendimiento y nuevos contenidos. Descárgalo ahora.",
      content:
        "La nueva versión incluye optimizaciones importantes y 15 mods nuevos para mejorar tu experiencia.",
    },
    {
      id: 4,
      title: "Nueva tienda de rangos",
      date: "2024-01-08",
      category: "Tienda",
      excerpt:
        "Renovamos completamente la tienda con nuevos rangos y beneficios. ¡Échale un vistazo!",
      content:
        "Los nuevos rangos incluyen más beneficios y precios más accesibles para todos.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Noticias
          </h1>
          <p className="text-lg text-muted-foreground">
            Mantente al día con las últimas novedades
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {news.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <time>{new Date(item.date).toLocaleDateString("es-ES")}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mb-3">{item.excerpt}</p>
                  <p className="text-sm text-muted-foreground/80">
                    {item.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Noticias;
