import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, LogIn } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Calendar className="w-6 h-6 text-accent" />
          <span>Eventos<span className="text-accent">Premium</span></span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
             Inicio
          </Link>
          <Link to="/eventos" className={`nav-link ${isActive('/eventos') ? 'active' : ''}`}>
             Eventos
          </Link>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
