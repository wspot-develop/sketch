import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import CarPage from './pages/car-page';
import CarCreatePage from './pages/car-create-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/car" element={<CarPage />} />
        <Route path="/car-create" element={<CarCreatePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
