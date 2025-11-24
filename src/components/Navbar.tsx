import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { AuthService } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  Home,
  Gamepad2,
  Trophy,
  ShoppingCart,
  Newspaper,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(AuthService.getCurrentUser());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/jugar", label: "Jugar", icon: Gamepad2 },
    { path: "/rankings", label: "Rankings", icon: Trophy },
    { path: "/tienda", label: "Tienda", icon: ShoppingCart },
    { path: "/noticias", label: "Noticias", icon: Newspaper },
    { path: "/foro", label: "Foro", icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-3 py-1.5 bg-gradient-primary rounded-lg font-bold text-lg">
                DARKSOW
              </div>
            </div>
            <span className="hidden md:block text-sm text-muted-foreground">Network</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/perfil">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.username}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm" className="bg-gradient-primary shadow-glow">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Settings className="w-4 h-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      {user.username}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-primary shadow-glow">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
