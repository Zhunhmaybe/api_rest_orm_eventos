
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventManagerPage from './pages/EventManagerPage';
import EventParticipantsPage from './pages/EventParticipantsPage';
import ParticipantManagerPage from './pages/ParticipantManagerPage';
import RoomManagerPage from './pages/RoomManagerPage';
import LoginPage from './pages/LoginPage';
import ParticipantEventsPage from './pages/ParticipantEventsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import WelcomePage from './pages/WelcomePage';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their appropriate dashboard if they have the wrong role
    return <Navigate to={user.role === 'participante' ? '/mis-eventos' : '/eventos'} />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Layout>
        {/* Helper to render layout only when logged in, or handled inside routes */}
      </Layout>}
      {/* Actually Layout wraps children, so we need to restructure a bit or wrap specific routes */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <WelcomePage /> : <Navigate to={user.role === 'participante' ? "/mis-eventos" : "/eventos"} />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'participante' ? "/mis-eventos" : "/eventos"} />} />

        {/* Participante Routes */}
        <Route path="/mis-eventos" element={
          <ProtectedRoute allowedRole="participante">
            <Layout><ParticipantEventsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Empleado Routes */}
        <Route path="/eventos" element={
          <ProtectedRoute allowedRole="empleado">
            <Layout><EventManagerPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/eventos/:eventId/participantes" element={
          <ProtectedRoute allowedRole="empleado">
            <Layout><EventParticipantsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/salas" element={
          <ProtectedRoute allowedRole="empleado">
            <Layout><RoomManagerPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/participantes" element={
          <ProtectedRoute allowedRole="empleado">
            <Layout><ParticipantManagerPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
