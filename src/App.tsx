import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import CarPage from './pages/car-page';
import CarCreatePage from './pages/car-create-page';
import ParkingOptonsPage from './pages/parking-options-page';
import CarStartParkingPage from './pages/parking-start-page';
import WaitingPlacePage from './pages/waiting-place';
import ParkingSpotsPage from './pages/parking-spots-page';
import ParkingMatchPage from './pages/parking-match';
import ParkingSuccessPage from './pages/parking-success';
import ParkingCreateSpotPage from './pages/parking-create-spot';
import CarNotificationPage from './pages/car-page-notification';
import ParkingWaitingMatchPage from './pages/parking-waiting-match';
import Page from './pages/page';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/parking-waiting-match/:car_id" element={<ParkingWaitingMatchPage />} />
        <Route path="/parking-create-spot/:car_id" element={<ParkingCreateSpotPage />} />
        <Route path="/parking-success" element={<ParkingSuccessPage />} />
        <Route path="/parking-match/:car_id" element={<ParkingMatchPage />} />
        <Route path="/parking-options/:car_id" element={<ParkingOptonsPage />} />
        <Route path="/waiting-place/:car_id" element={<WaitingPlacePage />} />
        <Route path="/car-start-parking/:car_id" element={<CarStartParkingPage />} />
        <Route path="/parking-spots/:car_id" element={<ParkingSpotsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cars" element={<CarPage />} />
        <Route path="/cars/:car_id" element={<CarNotificationPage />} />
        <Route path="/car-create" element={<CarCreatePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/page" element={<Page />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
