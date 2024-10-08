import { User } from "../types/auth";
import avatarDefault from "../assets/avatar_default.png";

interface AvatarProps {
  user: User | null;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

function Avatar({ user, width = 50, height = 50, style }: AvatarProps) {
  return (
    <img
      src={user?.avatar ? `https://deploy-chatapp-jjlk.onrender.com/${user.avatar}` : avatarDefault}
      alt={user?.fullname}
      className="rounded-circle mr-3"
      style={{ border: "1px solid var(--bg-primary-gentle)", ...style }}
      width={width}
      height={height}
    />
  );
}

export default Avatar;
