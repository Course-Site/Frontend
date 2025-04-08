import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import UserInfo from "../components/UserInfo/UserInfo";
import AdminPanel from "./AdminPanel";
import UserStats from "./UserStats";
import AuthModal from "../components/AuthModal/AuthModal";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalWasOpened, setModalWasOpened] = useState(false);
  const navigate = useNavigate();

  // Открываем модалку, если пользователь не авторизован
  useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
      setModalWasOpened(true); // флаг, что была попытка авторизации
    }
  }, [user]);

  // Редирект, если пользователь закрыл модалку и не авторизовался
  useEffect(() => {
    if (!authModalOpen && !user && modalWasOpened) {
      navigate("/");
    }
  }, [authModalOpen, user, modalWasOpened, navigate]);

  const handleCloseModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <AuthModal isOpen={authModalOpen} onClose={handleCloseModal} />

      {user && (
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-xl">
          <UserInfo name={user.name} />
          {user.role === "admin" ? <AdminPanel /> : <UserStats />}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
