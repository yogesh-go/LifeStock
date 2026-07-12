import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import GoalDetail from './pages/GoalDetail';
import CreateGoal from './pages/CreateGoal';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

// Protected route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
      <Route path="/goal/:id" element={<PrivateRoute><GoalDetail /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute><CreateGoal /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;