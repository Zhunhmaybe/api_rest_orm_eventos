
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventManagerPage from './pages/EventManagerPage';
import EventParticipantsPage from './pages/EventParticipantsPage';
import ParticipantManagerPage from './pages/ParticipantManagerPage';
import RoomManagerPage from './pages/RoomManagerPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventos" element={<EventManagerPage />} />
        <Route path="/eventos/:eventId/participantes" element={<EventParticipantsPage />} />
        <Route path="/salas" element={<RoomManagerPage />} />
        <Route path="/participantes" element={<ParticipantManagerPage />} />
      </Routes>
    </Layout>
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
