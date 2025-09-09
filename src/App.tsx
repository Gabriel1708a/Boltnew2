import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientSite from './pages/ClientSite';
import { AuthProvider } from './contexts/AuthContext';
import { CustomizationProvider } from './contexts/CustomizationContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <CustomizationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/admin/*" 
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard/*" 
                element={
                  <PrivateRoute requiredRole="client">
                    <ClientDashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/site/:clientId" element={<ClientSite />} />
            </Routes>
          </div>
        </Router>
      </CustomizationProvider>
    </AuthProvider>
  );
}

export default App;