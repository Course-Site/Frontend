import Layout from "./layouts/Layout";
import LearningPage from "./pages/LearningPage";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import AuthModal from "./components/AuthModal/AuthModal";
import { useState } from "react";

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
          <Route
            path="/learning"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/learning")}>
                <LearningPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute onOpenModal={() => openAuthModal("/profile")}>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* модалка авторизации */}
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
