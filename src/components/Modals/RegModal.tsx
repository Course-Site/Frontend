import React, { useState } from "react";
import Button from "../Button/Button";
import { signUp } from "../../store/authSlice";
import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";


interface RegModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const RegModal: React.FC<RegModalProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const resultAction = await dispatch(signUp({ name, email, password }));
    if (signUp.fulfilled.match(resultAction)) {
      onSuccess();
    } else {
      console.error("Ошибка регистрации:", resultAction.payload);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Добавить пользователя</h2>
        <input
          type="text"
          placeholder="Имя"
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
          <p className="text-center text-blue-500">Загрузка...</p>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Создать
            </Button>
          </div>
        )}

        {auth.error && (
          <p className="text-red-500 text-sm mt-2">{auth.error}</p>
        )}
      </div>
    </div>
  );
};

export default RegModal;