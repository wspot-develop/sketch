import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import CarPage from './pages/car-page';
import CarCreatePage from './pages/car-create-page';
import ParkingOptonsPage from './pages/parking-options-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/parking-options/:car_id" element={<ParkingOptonsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cars" element={<CarPage />} />
        <Route path="/car-create" element={<CarCreatePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
