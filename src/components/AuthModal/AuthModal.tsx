import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center 
          bg-[linear-gradient(53.187deg,_#52576E_0%,_#AFAEAE_25%,_#CCC6BA_50%,_#AEAEAE_75%,_#606777_100%)] 
          backdrop-blur-3xl z-50 text-center font-istok"
          onClick={handleBackdropClick}
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
              {isRegister
                ? "Создайте новый аккаунт!"
                : "Введите данные для входа!"}
            </p>

            <div className="flex flex-col gap-3">
              {isRegister && (
                <input
                  type="text"
                  placeholder="Имя"
                  className="border p-3 rounded-3xl"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded-3xl"
              />
              <input
                type="password"
                placeholder="Пароль"
                className="border p-3 rounded-3xl"
              />
              <Button variant="secondary">
                {isRegister ? "Зарегистрироваться" : "Войти"}
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
