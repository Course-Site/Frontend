import React, { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import AddUserForm from "../components/Modals/AddUserForm"; // путь может отличаться
import { Link } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

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

  const handleUserAdded = () => {
    setIsFormVisible(false);
    fetchUsers();
  };

  return (
    <div className="p-4 mb-10">
      <h3 className="text-lg font-semibold mb-4">Список пользователей</h3>
      <Button 
        variant="primary" 
        className="p-2"
        onClick={() => setIsFormVisible(true)}>
        Добавить пользователя
      </Button>

      {isFormVisible && (
        <AddUserForm onSuccess={handleUserAdded} onCancel={() => setIsFormVisible(false)} />
      )}

      {users.map((user) => (
        <div key={user.id} className="flex justify-between items-center border-b py-2">
          <div>
            <p>{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Link to={`/profile/admin/statistic/user/${user.id}`}>Статистика</Link>
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
