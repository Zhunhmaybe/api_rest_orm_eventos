
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Bienvenido</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Ingresa tus credenciales</p>
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Usuario</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin"
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
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Iniciar Sesión
          </button>
        </form>
        
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
           Credenciales de prueba:<br/> <code>admin</code> / <code>admin</code>
        </div>
      </div>
    </div>
  );
}
