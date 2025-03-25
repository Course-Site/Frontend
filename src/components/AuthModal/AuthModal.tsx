import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const url = isRegister
      ? "http://localhost:4200/api/v1/auth/sign-up"
      : "http://localhost:4200/api/v1/auth/sign-in";

    const body = isRegister
      ? { name, email, password }
      : { email, password };

      console.log("Отправляем данные:", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при авторизации");
      }
      const message = isRegister
        ? "Пользователь зарегистрирован"
        : "Вход пользователя";
      console.log(message, data);
      console.log("Успех:", data);

      onClose(); // Закрываем модальное окно при успешном входе/регистрации
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center 
          bg-[linear-gradient(53.187deg,_#52576E_0%,_#AFAEAE_25%,_#CCC6BA_50%,_#AEAEAE_75%,_#606777_100%)] 
          backdrop-blur-3xl z-50 text-center font-istok"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {isRegister ? "Регистрация" : "Вход"}
            </h2>
            <p className="text-gray-600 mb-4">
              {isRegister ? "Создайте новый аккаунт!" : "Введите данные для входа!"}
            </p>

            <div className="flex flex-col gap-3">
              {isRegister && (
                <input
                  type="text"
                  placeholder="Имя"
                  className="border p-3 rounded-3xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded-3xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Пароль"
                className="border p-3 rounded-3xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="secondary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Загрузка..." : isRegister ? "Зарегистрироваться" : "Войти"}
              </Button>
              <div className="text-center">
                {isRegister ? (
                  <span>
                    Уже есть аккаунт?
                    <button
                      className="text-amber-500 hover:underline hover:text-red-800 ml-1 cursor-pointer"
                      onClick={() => setIsRegister(false)}
                    >
                      Войти
                    </button>
                  </span>
                ) : (
                  <span>
                    Нет профиля?
                    <button
                      className="text-amber-500 hover:underline hover:text-red-800 ml-1 cursor-pointer"
                      onClick={() => setIsRegister(true)}
                    >
                      Зарегистрируйтесь!
                    </button>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-amber-500 hover:text-red-800 w-20 cursor-pointer"
            >
              Закрыть
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
