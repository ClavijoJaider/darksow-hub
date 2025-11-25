import { User as UserIcon } from "lucide-react";

interface UserAvatarProps {
  avatar?: string;
  username: string;
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({ avatar, username, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-primary rounded-full flex items-center justify-center shadow-glow overflow-hidden flex-shrink-0`}>
      {avatar ? (
        <img src={avatar} alt={username} className="w-full h-full object-cover" />
      ) : (
        <UserIcon className={`${iconSizes[size]} text-foreground`} />
      )}
    </div>
  );
};
