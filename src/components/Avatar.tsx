// components/Avatar.tsx
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const API_BASE = "http://localhost:8081/api";

const Avatar = ({
  src,
  alt = "Profile",
  name = "U",
  size = "md",
  className = "",
}: AvatarProps) => {
  // Size mapping
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-20 h-20 text-xl",
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle API base URL for avatar sources
  const getAvatarSrc = (src: string | undefined) => {
    if (!src) return undefined;
    return src.startsWith("http") ? src : `${API_BASE}${src}`;
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      {src ? (
        <img
          src={getAvatarSrc(src)}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white font-bold">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
