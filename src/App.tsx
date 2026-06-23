import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage';
import MaintenancePage from './pages/MaintenancePage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-left" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            <Route path="/devices" element={<ProtectedRoute><Layout><DevicesPage /></Layout></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><Layout><MapPage /></Layout></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Layout><ChatPage /></Layout></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><Layout><MaintenancePage /></Layout></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Layout><RequestsPage /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
