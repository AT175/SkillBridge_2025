import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Opportunities from './pages/Opportunities';
import Applications from './pages/Applications';
import AdminPanel from './pages/AdminPanel';
import Messaging from './pages/Messaging';
import Notifications from './pages/Notifications';
import { AuthProvider, AuthContext } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard userId={user?.id} role={user?.role} />} />
      <Route path="/profile" element={<Profile userId={user?.id} role={user?.role} />} />
      <Route path="/opportunities" element={<Opportunities userId={user?.id} role={user?.role} />} />
      <Route path="/applications" element={<Applications userId={user?.id} role={user?.role} />} />
      <Route path="/messaging" element={<Messaging userId={user?.id} />} />
      <Route path="/notifications" element={<Notifications userId={user?.id} />} />
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
// For performance, consider using React.lazy and Suspense for route components.

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
