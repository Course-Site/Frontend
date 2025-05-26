// components/Forms/AddUserForm.tsx
import React, { useState } from "react";
import Button from "../Button/Button";
import { adminAddUser } from "../../store/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const resultAction = await dispatch(adminAddUser({ name, email, password }));
    if (adminAddUser.fulfilled.match(resultAction)) {
      onSuccess();
    } else {
      console.error("Ошибка регистрации:", resultAction.payload);
    }
  };

  return (
    <div className="bg-white border p-4 mt-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Новый пользователь</h2>
      <input
        type="text"
        placeholder="Фамилия Имя Отчество"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />

      {auth.loading ? (
        <p className="text-blue-500">Добавление...</p>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} className="p-1"> 
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="p-1">
            Создать
          </Button>
        </div>
      )}

      {auth.error && (
        <p className="text-red-500 text-sm mt-2">{auth.error}</p>
      )}
    </div>
  );
};

export default AddUserForm;
