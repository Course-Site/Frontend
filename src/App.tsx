import Layout from "./layouts/Layout";
import LearningPage from "./pages/LearningPage";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import AuthModal from "./components/Modals/AuthModal";
import { useEffect, useState } from "react";
import LecturePage from "./pages/LecturePage";
import LectureEditor from "./pages/LectureEditor";
import LabPage from "./pages/LabPage";
import LabEditor from "./pages/LabEditor";
import TestEditor from "./pages/TestEditor";
import TestPage from "./pages/TestPage";
import NeuralNetworkChat from "./pages/NeuralNetworkChat";
import UserStatisticPage from "./pages/UserStatisticPage";
import { AppDispatch} from "../src/store/store";
import { initAuth } from "./store/authSlice";
import { RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch<AppDispatch>();
   const { initialized } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [requestedPath, setRequestedPath] = useState<string | null>(null);

  const openAuthModal = (path: string) => {
    setRequestedPath(path);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setRequestedPath(null);
  };

if (!initialized) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#757884',
      color: '#f5f5f5',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ marginBottom: 20 }}>
        <div className="loader"></div>
      </div>
      <div>Загрузка...</div>

      {/* Стили для лоадера */}
      <style>{`
        .loader {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #f78f1e; /* оранжевый */
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 10px #f78f1e;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

  return (
    
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />

          {/* Страница обучения */}
          <Route
            path="/learning"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/learning")}>
                <LearningPage />
              </PrivateRoute>
            }
          />

          {/* Страница профиля */}
          <Route
            path="/profile"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/profile")}>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Страница нейросети */}
          <Route
            path="/ai"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/profile")}>
                <NeuralNetworkChat />
              </PrivateRoute>
            }
          />

          {/* Страница стастики пользователя для админа */}
          <Route
            path="/profile/admin/statistic/user/:id"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/profile")}>
                <UserStatisticPage />
              </PrivateRoute>
            }
          />

          {/* Маршруты для лекций */}
          <Route
            path="/lecture/create"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lecture/create")}>
                <LectureEditor isEdit={false} />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/edit/:id"
            element={
              <PrivateRoute onOpenModal={(path) => openAuthModal(path)}>
                <LectureEditor isEdit={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/:id"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lecture/:id")}>
                <LecturePage />
              </PrivateRoute>
            }
          />

          {/* Маршруты для лабораторных работ */}
          <Route
            path="/lab/create"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lab/create")}>
                <LabEditor isEdit={false} />
              </PrivateRoute>
            }
          />
          <Route
            path="/lab/edit/:id"
            element={
              <PrivateRoute onOpenModal={(path) => openAuthModal(path)}>
                <LabEditor isEdit={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/lab/:id"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lab/:id")}>
                <LabPage />
              </PrivateRoute>
            }
          />

          {/* Маршруты для тестов */}
          <Route
            path="/test/create"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/test/create")}>
                <TestEditor isEdit={false} />
              </PrivateRoute>
            }
          />
          <Route
            path="/test/edit/:id"
            element={
              <PrivateRoute onOpenModal={(path) => openAuthModal(path)}>
                <TestEditor isEdit={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/test/:testId"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/test/:id")}>
                <TestPage />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* Модальное окно авторизации */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          requestedPath={requestedPath}
        />
      </Layout>
    </Router>
  );
}

export default App;