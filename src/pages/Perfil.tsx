import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService, User } from "@/lib/auth";
import { toast } from "sonner";
import { User as UserIcon, Star, Coins, Heart, Save, Upload } from "lucide-react";

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    minecraft_username: "",
    profile_description: "",
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(currentUser);
    setFormData({
      username: currentUser.username,
      minecraft_username: currentUser.minecraft_username || "",
      profile_description: currentUser.profile_description || "",
    });
  }, [navigate]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        avatar: reader.result as string,
      };
      AuthService.updateUser(updatedUser);
      setUser(updatedUser);
      toast.success("Imagen de perfil actualizada");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      username: formData.username,
      minecraft_username: formData.minecraft_username,
      profile_description: formData.profile_description,
    };

    AuthService.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    toast.success("Perfil actualizado");
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-destructive";
      case "moderador":
        return "text-secondary";
      case "vip":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="p-8 border-border bg-gradient-to-br from-card to-muted">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-foreground" />
                  )}
                </div>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Upload className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {user.username}
                </h1>
                <p className="text-muted-foreground">
                  {user.minecraft_username || "Sin usuario de Minecraft"}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getRoleColor(
                      user.role
                    )} bg-card border border-current`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setEditing(!editing)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                {editing ? "Cancelar" : "Editar Perfil"}
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats?.level || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Nivel</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border hover:border-secondary transition-all duration-300 hover:shadow-gold-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Coins className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats?.coins?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Coins</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {user.stats?.karma || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Karma</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Edit Form */}
          {editing && (
            <Card className="p-6 border-border space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                Editar Información
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minecraft_username">
                    Usuario de Minecraft
                  </Label>
                  <Input
                    id="minecraft_username"
                    value={formData.minecraft_username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minecraft_username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile_description">
                    Sobre mí
                  </Label>
                  <Input
                    id="profile_description"
                    placeholder="Escribe una breve descripción sobre ti..."
                    value={formData.profile_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile_description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </Card>
          )}

          {/* Account Info */}
          <Card className="p-6 border-border space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Información de Cuenta
            </h2>
            <div className="grid gap-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Miembro desde</span>
                <span className="text-foreground">
                  {new Date(user.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex flex-col py-2 space-y-2">
                <span className="text-muted-foreground">Rango Actual</span>
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Este rango es asignado por el sistema y solo puede ser actualizado por un administrador.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
