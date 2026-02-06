import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="hero-section">
      <div className="container animate-fade-in">
        <h1 className="hero-title">
          Gestiona tus Eventos <br />
          con Estilo
        </h1>
        <p className="hero-subtitle">
          La plataforma más moderna para descubrir, organizar y participar en eventos exclusivos.
          Diseñada para una experiencia inolvidable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/eventos" className="btn btn-primary">
            Explorar Eventos <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
