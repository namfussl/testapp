import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientHome from './pages/ClientHome';
import FeeEarnerHome from './pages/FeeEarnerHome';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/client-home"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <ClientHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fee-earner-home"
            element={
              <ProtectedRoute requiredRole="FEE_EARNER">
                <FeeEarnerHome />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const UnauthorizedPage = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: 'Arial, sans-serif',
  }}>
    <h1>Access Denied</h1>
    <p>You do not have permission to access this page.</p>
    <a href="/" style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      textDecoration: 'none',
    }}>
      Go Home
    </a>
  </div>
);

export default App;
