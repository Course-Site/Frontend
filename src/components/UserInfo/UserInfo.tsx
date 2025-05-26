import React from "react";

interface UserInfoProps {
  name: string;
  avatarUrl?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name}) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div>
        <h2 className="text-xl font-semibold">Username: {name}</h2>
      </div>
    </div>
  );
};

export default UserInfo;
