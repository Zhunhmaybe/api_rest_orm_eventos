import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('empleado');
  const [error, setError] = useState('');
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const eyeRef = useRef(null);

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (eyeRef.current && !isPasswordFocused) {
        const eyeRect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(8, Math.sqrt(Math.pow(e.clientX - eyeCenterX, 2) + Math.pow(e.clientY - eyeCenterY, 2)) / 20);

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        setEyePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPasswordFocused]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password, role);
    if (result.success) {
      if (role === 'participante') {
        navigate('/mis-eventos');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)'
    }}>
      <div className="glass-panel" style={{
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Bienvenido</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Ingresa tus credenciales</p>
        </div>

        <div ref={eyeRef} style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem 0',
          transition: 'all 0.3s ease'
        }}>
          <svg width="120" height="100" viewBox="0 0 120 100" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}>
            <g>
              <ellipse
                cx="35"
                cy="35"
                rx="18"
                ry={isPasswordFocused ? "3" : "14"}
                fill="white"
                stroke="#ef4444"
                strokeWidth="2"
                style={{ transition: 'all 0.3s ease' }}
              />
              {!isPasswordFocused && (
                <circle
                  cx={35 + eyePosition.x}
                  cy={35 + eyePosition.y}
                  r="7"
                  fill="#ef4444"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
              {!isPasswordFocused && (
                <circle
                  cx={35 + eyePosition.x}
                  cy={35 + eyePosition.y}
                  r="3"
                  fill="#7f1d1d"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
              {!isPasswordFocused && (
                <circle
                  cx={36 + eyePosition.x}
                  cy={33 + eyePosition.y}
                  r="2"
                  fill="white"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
            </g>

            <g>
              <ellipse
                cx="85"
                cy="35"
                rx="18"
                ry={isPasswordFocused ? "3" : "14"}
                fill="white"
                stroke="#ef4444"
                strokeWidth="2"
                style={{ transition: 'all 0.3s ease' }}
              />
              {!isPasswordFocused && (
                <circle
                  cx={85 + eyePosition.x}
                  cy={35 + eyePosition.y}
                  r="7"
                  fill="#ef4444"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
              {!isPasswordFocused && (
                <circle
                  cx={85 + eyePosition.x}
                  cy={35 + eyePosition.y}
                  r="3"
                  fill="#7f1d1d"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
              {!isPasswordFocused && (
                <circle
                  cx={86 + eyePosition.x}
                  cy={33 + eyePosition.y}
                  r="2"
                  fill="white"
                  style={{ transition: 'all 0.1s ease' }}
                />
              )}
            </g>

            <path
              d="M 20 22 Q 35 17 50 22"
              stroke="#cfc9c9ff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{
                transform: isPasswordFocused ? 'translateY(2px)' : isUsernameFocused ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            />
            <path
              d="M 70 22 Q 85 17 100 22"
              stroke="#cfc9c9ff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{
                transform: isPasswordFocused ? 'translateY(2px)' : isUsernameFocused ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            />

            {/* Boca - Sonrisa normal */}
            {!isUsernameFocused && !isPasswordFocused && (
              <path
                d="M 40 70 Q 60 80 80 70"
                stroke="#ffffffff"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{ transition: 'all 0.3s ease' }}
              />
            )}

            {/* Boca - Asombro (O) cuando escribe usuario */}
            {isUsernameFocused && (
              <ellipse
                cx="60"
                cy="72"
                rx="10"
                ry="14"
                fill="none"
                stroke="#ffffffff"
                strokeWidth="3"
                style={{ transition: 'all 0.3s ease' }}
              />
            )}

            {isPasswordFocused && (
              <line
                x1="40"
                y1="70"
                x2="80"
                y2="70"
                stroke="#ffffffff"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transition: 'all 0.3s ease' }}
              />
            )}
          </svg>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              {role === 'empleado' ? 'Usuario' : 'Correo o Cédula'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                placeholder={role === 'empleado' ? "Ej. admin" : "juan@example.com"}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Iniciar Sesión
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Regístrate aquí</Link>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          Credenciales de prueba:<br /> <code>admin</code> / <code>admin</code>
        </div>
      </div>
    </div>
  );
}