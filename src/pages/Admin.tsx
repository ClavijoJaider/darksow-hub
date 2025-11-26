import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthService, User, UserRole } from "@/lib/auth";
import { NewsService } from "@/lib/news";
import { useStorageSync } from "@/hooks/useStorageSync";
import { toast } from "sonner";
import {
  Users,
  Shield,
  Settings,
  Activity,
  Crown,
  Star,
  Newspaper,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const users = useStorageSync('users', () => AuthService.getAllUsers());
  const news = useStorageSync('news', () => NewsService.getNews());
  const [activeTab, setActiveTab] = useState<"users" | "news">("users");
  
  // News form state
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      toast.error("Acceso denegado: Solo administradores");
      navigate("/");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!currentUser) return;
    
    const userToUpdate = users.find((u) => u.id === userId);
    if (!userToUpdate) return;
    
    // Solo Super Admin puede cambiar rol a Admin
    if (newRole === 'admin' && currentUser.role !== 'super_admin') {
      toast.error("Solo Super Admin puede asignar el rol de Admin");
      return;
    }

    const updatedUser = { ...userToUpdate, role: newRole };
    AuthService.updateUser(updatedUser);
    toast.success(`Rol de ${userToUpdate.username} actualizado a ${newRole}`);
  };

  const handleCreateNews = () => {
    if (!currentUser) return;
    
    if (!newsForm.title || !newsForm.content) {
      toast.error("Título y contenido son obligatorios");
      return;
    }

    NewsService.createArticle(
      newsForm.title,
      newsForm.excerpt,
      newsForm.content,
      newsForm.cover_image || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",
      newsForm.category || "Anuncios",
      currentUser.id,
      currentUser.username
    );

    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      cover_image: "",
      category: "",
    });

    toast.success("Noticia publicada");
  };

  const handleDeleteNews = (id: string) => {
    NewsService.deleteArticle(id);
    toast.success("Noticia eliminada");
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4 text-gold" />;
      case "admin":
        return <Shield className="w-4 h-4 text-destructive" />;
      case "moderador":
        return <Star className="w-4 h-4 text-secondary" />;
      case "vip":
        return <Crown className="w-4 h-4 text-primary" />;
      default:
        return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === "super_admin";

  return (
    <div className="min-h-screen bg-gradient-dark pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-destructive to-secondary bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestión del servidor Darksow Network
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-4 h-4 mr-2" />
            Usuarios
          </Button>
          <Button
            variant={activeTab === "news" ? "default" : "outline"}
            onClick={() => setActiveTab("news")}
          >
            <Newspaper className="w-4 h-4 mr-2" />
            Noticias
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
          <Card className="p-4 border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.length}
                </p>
                <p className="text-xs text-muted-foreground">Usuarios</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border hover:border-destructive transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.role === "admin" || u.role === "super_admin").length}
                </p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border hover:border-secondary transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.role === "moderador").length}
                </p>
                <p className="text-xs text-muted-foreground">Moderadores</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border hover:border-primary transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{news.length}</p>
                <p className="text-xs text-muted-foreground">Noticias</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="max-w-6xl mx-auto">
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Gestión de Usuarios
                </h2>
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="p-4 border-border hover:border-primary transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getRoleIcon(user.role)}
                          <p className="font-semibold text-foreground">
                            {user.username}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        {user.minecraft_username && (
                          <p className="text-xs text-muted-foreground">
                            MC: {user.minecraft_username}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">
                            Nivel {user.stats?.level || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.stats?.coins?.toLocaleString() || 0} coins
                          </p>
                        </div>

                        <Select
                          value={user.role}
                          onValueChange={(value: UserRole) =>
                            handleRoleChange(user.id, value)
                          }
                          disabled={user.id === currentUser.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usuario">Usuario</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="moderador">Moderador</SelectItem>
                            {isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
                            {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* News Management */}
        {activeTab === "news" && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Create News */}
            <Card className="p-6 border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Publicar Noticia
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newsForm.title}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, title: e.target.value })
                    }
                    placeholder="Título de la noticia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extracto</Label>
                  <Input
                    id="excerpt"
                    value={newsForm.excerpt}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, excerpt: e.target.value })
                    }
                    placeholder="Breve descripción"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={newsForm.category}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, category: e.target.value })
                    }
                    placeholder="Ej: Anuncios, Actualizaciones"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Imagen de Portada (URL)</Label>
                  <Input
                    id="cover"
                    value={newsForm.cover_image}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, cover_image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    value={newsForm.content}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, content: e.target.value })
                    }
                    placeholder="Contenido completo de la noticia"
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleCreateNews}
                  className="w-full bg-gradient-primary shadow-glow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Noticia
                </Button>
              </div>
            </Card>

            {/* News List */}
            <Card className="p-6 border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Noticias Publicadas
              </h2>
              <div className="space-y-4">
                {news.length > 0 ? (
                  news.map((article) => (
                    <Card key={article.id} className="p-4 border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-1">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{new Date(article.published_at).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNews(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay noticias publicadas
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
