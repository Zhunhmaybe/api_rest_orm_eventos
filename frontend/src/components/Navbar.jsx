
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Calendar className="w-6 h-6 text-accent" />
          <span>Eventos<span className="text-accent">Premium</span></span>
        </Link>
        
        <div className="nav-links">
          {user && user.role === 'empleado' && (
            <>
              <Link to="/eventos" className={`nav - link ${ isActive('/eventos') ? 'active' : '' } `}>
                Eventos
              </Link>
              <Link to="/salas" className={`nav - link ${ isActive('/salas') ? 'active' : '' } `}>
                Salas
              </Link>
              <Link to="/participantes" className={`nav - link ${ isActive('/participantes') ? 'active' : '' } `}>
                Participantes
              </Link>
            </>
          )}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {user.nombre} ({user.role})
                </span>
                <button 
                    onClick={handleLogout}
                    className="btn-icon"
                    title="Cerrar Sesión"
                    style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}
                >
                    <LogOut size={18} />
                </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
