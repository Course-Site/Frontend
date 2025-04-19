import Layout from "./layouts/Layout";
import LearningPage from "./pages/LearningPage";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import AuthModal from "./components/Modals/AuthModal";
import { useState } from "react";
import LecturePage from "./pages/LecturePage";  // Страница для просмотра лекции
import LectureEditor from "./pages/LectureEditor";  // Страница для создания и редактирования лекции

function App() {
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

          {/* Страница для создания новой лекции */}
          <Route
            path="/lecture/create"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lecture/create")}>
                <LectureEditor isEdit={false} />
              </PrivateRoute>
            }
          />

          {/* Страница для редактирования лекции по ID */}
          <Route
            path="/lecture/edit/:id"
            element={
              <PrivateRoute onOpenModal={(path) => openAuthModal(path)}>
                <LectureEditor isEdit={true} />
              </PrivateRoute>
            }
          />

          {/* Страница для просмотра лекции (не редактирование) */}
          <Route
            path="/lecture/:id"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/lecture/:id")}>
                <LecturePage />
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
