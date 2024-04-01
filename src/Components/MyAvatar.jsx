import { Avatar } from "@nextui-org/react";
import "./MyAvatar.css"
export function MyAvatar() {
  return (
    <div className="my-avatar-container">
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-25 h-25 text-large" />
      <p className="avatar-description">Avatar</p>
    </div>
  );
}

