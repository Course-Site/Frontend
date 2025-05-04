import Layout from "./layouts/Layout";
import LearningPage from "./pages/LearningPage";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import AuthModal from "./components/Modals/AuthModal";
import { useState } from "react";
import LecturePage from "./pages/LecturePage";
import LectureEditor from "./pages/LectureEditor";
import LabPage from "./pages/LabPage";
import LabEditor from "./pages/LabEditor";
import TestEditor from "./pages/TestEditor";
import TestPage from "./pages/TestPage";

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