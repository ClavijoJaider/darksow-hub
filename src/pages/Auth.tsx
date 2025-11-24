import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AuthService } from "@/lib/auth";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    minecraft_username: "",
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      const user = AuthService.login(formData.email, formData.password);
      if (user) {
        toast.success(`¡Bienvenido, ${user.username}!`);
        navigate("/");
      } else {
        toast.error("Credenciales incorrectas");
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        toast.error("Por favor completa todos los campos");
        return;
      }
      
      const user = AuthService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.minecraft_username
      );
      toast.success(`¡Cuenta creada! Bienvenido, ${user.username}`);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-card/95 backdrop-blur border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Accede a tu cuenta de Darksow Network"
              : "Únete a la comunidad de Darksow Network"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required={mode === "register"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="minecraft_username">
                Usuario de Minecraft (Opcional)
              </Label>
              <Input
                id="minecraft_username"
                type="text"
                placeholder="Tu usuario de Minecraft"
                value={formData.minecraft_username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minecraft_username: e.target.value,
                  })
                }
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all"
          >
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>

        {mode === "login" && (
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Cuentas de prueba:
            </p>
            <div className="text-xs text-muted-foreground space-y-1 text-center">
              <p>Admin: admin@darksow.net</p>
              <p>Moderador: mod@darksow.net</p>
              <p className="text-xs opacity-70">(cualquier contraseña)</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth;
