import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Crown, Zap, Star, Shield } from "lucide-react";
import { toast } from "sonner";
import { AuthService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Tienda = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handlePurchase = (item: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      navigate("/auth");
      return;
    }
    toast.success(`${item} añadido al carrito`);
  };

  const products = [
    {
      name: "VIP",
      price: "$4.99",
      icon: Star,
      color: "secondary",
      features: [
        "Chat con color",
        "Kit VIP mensual",
        "Acceso a /fly",
        "2x experiencia",
      ],
    },
    {
      name: "VIP+",
      price: "$9.99",
      icon: Crown,
      color: "primary",
      popular: true,
      features: [
        "Todo de VIP",
        "Kit VIP+ mensual",
        "Pets exclusivos",
        "3x experiencia",
        "Prioridad en cola",
      ],
    },
    {
      name: "MVP",
      price: "$19.99",
      icon: Shield,
      color: "primary",
      features: [
        "Todo de VIP+",
        "Kit MVP mensual",
        "Comandos especiales",
        "5x experiencia",
        "Partículas únicas",
      ],
    },
  ];

  const items = [
    { name: "1,000 Coins", price: "$0.99", icon: Zap },
    { name: "5,000 Coins", price: "$3.99", icon: Zap },
    { name: "25,000 Coins", price: "$14.99", icon: Zap },
    { name: "Crate Key", price: "$2.99", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tienda
          </h1>
          <p className="text-lg text-muted-foreground">
            Mejora tu experiencia en Darksow Network
          </p>
        </div>

        {/* Ranks Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Rangos</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Card
                  key={product.name}
                  className={`relative overflow-hidden border-border hover:border-${product.color} transition-all duration-300 ${
                    product.popular ? "shadow-glow border-primary" : ""
                  }`}
                >
                  {product.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-primary rounded-full text-xs font-bold shadow-glow">
                      Popular
                    </div>
                  )}
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div
                        className={`w-12 h-12 ${
                          product.color === "primary"
                            ? "bg-gradient-primary shadow-glow"
                            : "bg-gradient-gold shadow-gold-glow"
                        } rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        {product.price}
                        <span className="text-sm text-muted-foreground">
                          /mes
                        </span>
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        product.color === "primary"
                          ? "bg-gradient-primary shadow-glow"
                          : "bg-gradient-gold shadow-gold-glow"
                      } hover:shadow-gold-glow transition-all`}
                      onClick={() => handlePurchase(product.name)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Items</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.name}
                  className="p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        {item.price}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      size="sm"
                      onClick={() => handlePurchase(item.name)}
                    >
                      Comprar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-border">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              💳 Métodos de pago: PayPal, Tarjeta de Crédito/Débito
            </p>
            <p className="text-xs text-muted-foreground">
              Todas las compras son procesadas de forma segura
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tienda;
