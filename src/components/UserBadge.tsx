import { UserRole } from "@/lib/auth";

interface UserBadgeProps {
  role: UserRole;
}

export const UserBadge = ({ role }: UserBadgeProps) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "text-destructive border-destructive bg-destructive/10";
      case "moderador":
        return "text-secondary border-secondary bg-secondary/10";
      case "vip":
        return "text-primary border-primary bg-primary/10";
      default:
        return "text-muted-foreground border-border bg-muted";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getRoleColor(role)}`}>
      {role}
    </span>
  );
};
