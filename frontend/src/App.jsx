import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventManagerPage from './pages/EventManagerPage';
import './App.css';

import ParticipantManagerPage from './pages/ParticipantManagerPage';
import RoomManagerPage from './pages/RoomManagerPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventos" element={<EventManagerPage />} />
        <Route path="/salas" element={<RoomManagerPage />} />
        <Route path="/participantes" element={<ParticipantManagerPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
