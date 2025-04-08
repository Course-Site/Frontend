import React from "react";

interface UserInfoProps {
  name: string;
  avatarUrl?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, avatarUrl }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <img
        src={avatarUrl || "/default-avatar.png"}
        alt="Аватар"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
      </div>
    </div>
  );
};

export default UserInfo;
