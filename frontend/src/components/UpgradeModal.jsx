
import React from 'react';
import { X, Check, Star, Zap, Shield } from 'lucide-react';

export default function UpgradeModal({ onClose }) {
  return (
    <div className="modal-backdrop" style={{ zIndex: 2000 }}>
      <div className="glass-panel animate-fade-in" style={{ 
        maxWidth: '900px', 
        width: '90%', 
        padding: '2rem',
        border: '1px solid var(--color-accent)',
        boxShadow: '0 0 50px rgba(99, 102, 241, 0.2)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Estás en tu Prueba Gratuita
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Desbloquea todo el potencial de tu gestión de eventos.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          
          {/* Mensual */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--color-surface-border)', position: 'relative' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#60a5fa" /> Mensual
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              $20 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/mes</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Perfecto para empezar con flexibilidad.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> Vistas Ilimitadas</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> Soporte Básico</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> Sin Anuncios</li>
            </ul>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Elegir Mensual</button>
          </div>

          {/* Anual (Featured) */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '2px solid var(--color-accent)', transform: 'scale(1.05)', position: 'relative', background: 'rgba(99, 102, 241, 0.1)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              MÁS POPULAR
            </div>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Star size={20} fill="currentColor" /> Anual
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              $230 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/año</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Ahorra $10 al año y obtén beneficios extra.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-accent)" /> <strong>Todo lo del Mensual</strong></li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-accent)" /> Soporte Prioritario 24/7</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-accent)" /> Acceso a Betas</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-accent)" /> Análisis Avanzado</li>
            </ul>
            <button className="btn btn-primary" style={{ width: '100%' }}>Actualizar Ahora</button>
          </div>

          {/* Enterprise */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--color-surface-border)' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#10b981" /> Empresas
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Custom
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Soluciones a medida para grandes organizaciones.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> Todo Ilimitado</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> API Dedicada</li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="var(--color-success)" /> Gestor de Cuenta</li>
            </ul>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Contactar Ventas</button>
          </div>

        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Continuar con la versión gratuita (limitada)
          </button>
        </div>
      </div>
    </div>
  );
}
