import Layout from "./layouts/Layout"
import LearningPage from "./pages/LearningPage";
import MainPage from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/learning" element={<LearningPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App
