import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:4200/api/v1/user/getAll", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id: string) => {
    await fetch(`http://localhost:4200/api/v1/user/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUsers(users.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Список пользователей</h3>
      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center border-b py-2">
          <div>
            <p>{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => deleteUser(user.id)}
            className="text-red-500 hover:underline"
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
