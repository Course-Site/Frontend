import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  onOpenModal: (path: string) => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, onOpenModal }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      onOpenModal(location.pathname); // 👈 сохраняем путь
    }
  }, [user, location.pathname, onOpenModal]);

  if (!user) return null; // 👈 Не рендерим защищённый компонент, если пользователь не авторизован

  return <>{children}</>;
};

export default PrivateRoute;
