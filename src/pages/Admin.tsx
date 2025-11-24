import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthService, User, UserRole } from "@/lib/auth";
import { toast } from "sonner";
import {
  Users,
  Shield,
  Settings,
  Activity,
  Crown,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== "admin") {
      toast.error("Acceso denegado: Solo administradores");
      navigate("/");
      return;
    }
    setCurrentUser(user);
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const allUsers = AuthService.getAllUsers();
    setUsers(allUsers);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const userToUpdate = users.find((u) => u.id === userId);
    if (!userToUpdate) return;

    const updatedUser = { ...userToUpdate, role: newRole };
    AuthService.updateUser(updatedUser);
    loadUsers();
    toast.success(`Rol de ${userToUpdate.username} actualizado a ${newRole}`);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
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

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-destructive to-secondary bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestión del servidor Darksow Network
          </p>
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
                  {users.filter((u) => u.role === "admin").length}
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
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">247</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Management */}
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
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usuario">Usuario</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="moderador">Moderador</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
