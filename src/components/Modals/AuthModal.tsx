import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedPath?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, requestedPath }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    dispatch(signIn({ email, password }));
  };

  useEffect(() => {
    if (user) {
      onClose();
      if (requestedPath) {
        navigate(requestedPath, { replace: true });
      }
    }
  }, [user, onClose, navigate, requestedPath]);

  const handleCloseAndGoHome = () => {
    onClose();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center 
          bg-[linear-gradient(53.187deg,_#52576E_0%,_#AFAEAE_25%,_#CCC6BA_50%,_#AEAEAE_75%,_#606777_100%)] 
          backdrop-blur-3xl z-50 text-center font-istok"
          onClick={(e) => e.target === e.currentTarget && handleCloseAndGoHome()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Авторизация</h2>
            <p className="text-gray-600 mb-4">Введите данные для входа. Их вам должен предоставить преподаватель.</p>

            <div className="flex flex-col gap-3">
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
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button variant="secondary" onClick={handleSubmit} disabled={loading} className="p-3 border-amber-950">
                {loading ? "Загрузка..." : "Войти"}
              </Button>
            </div>

            <button
              onClick={handleCloseAndGoHome}
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
