import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WsProvider } from './ws-provider';
import Page from './pages/page';
import Simulator from './pages/simulator';
import LoginDesktop from './pages/login';
import RegisterPage from './pages/register-page';

function App() {
  return (
    <WsProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginDesktop />} />
        <Route path="/page" element={<Page />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/simulator/:booking_id" element={<Simulator />} />
      </Routes>
    </Router>
    </WsProvider>
  );
}

export default App;
