import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WsProvider } from './ws-provider';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import CarPage from './pages/car-page';
import CarCreatePage from './pages/car-create-page';
import ParkingOptionsPage from './pages/parking-options-page';
import CarStartParkingPage from './pages/parking-start-page';
import WaitingPlacePage from './pages/waiting-place';
import ParkingSpotsPage from './pages/parking-spots-page';
import ParkingMatchPage from './pages/parking-match';
import ParkingSuccessPage from './pages/parking-success';
import ParkingCreateSpotPage from './pages/parking-create-spot';
import CarNotificationPage from './pages/car-page-notification';
import ParkingWaitingMatchPage from './pages/parking-waiting-match';
import Page from './pages/page';
import ParkedWaitingPage from './pages/parked-waiting';
import SearchSpotPage from './pages/search-spot-page';


function App() {
  return (
    <WsProvider>
    <Router>
      <Routes>
        <Route path="/search-spot/:vehicle_id" element={<SearchSpotPage />} />
        <Route path="/parked-waiting/:vehicle_id" element={<ParkedWaitingPage />} />
        <Route path="/parking-waiting-match/:vehicle_id" element={<ParkingWaitingMatchPage />} />
        <Route path="/parking-create-spot/:vehicle_id" element={<ParkingCreateSpotPage />} />
        <Route path="/parking-success" element={<ParkingSuccessPage />} />
        <Route path="/parking-match/:vehicle_id" element={<ParkingMatchPage />} />
        <Route path="/parking-options/:user_id/:vehicle_id" element={<ParkingOptionsPage />} />
        <Route path="/waiting-place/:vehicle_id" element={<WaitingPlacePage />} />
        <Route path="/waiting" element={<WaitingPlacePage />} />
        <Route path="/car-start-parking/:user_id/:vehicle_id" element={<CarStartParkingPage />} />
        <Route path="/parking-spots/:vehicle_id" element={<ParkingSpotsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cars" element={<CarPage />} />
        <Route path="/cars/:vehicle_id" element={<CarNotificationPage />} />
        <Route path="/car-create" element={<CarCreatePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/page" element={<Page />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </WsProvider>
  );
}

export default App;
