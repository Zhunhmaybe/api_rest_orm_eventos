import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

const EVENTS_MOCK = [
  {
    id: 1,
    titulo: 'Tech Conference 2026',
    descripcion: 'El evento más importante de tecnología del año. Conferencias, workshops y networking.',
    fecha: '2026-03-15',
    hora: '09:00',
    ubicacion: 'Centro de Convenciones',
    organizador: 'TechWorld'
  },
  {
    id: 2,
    titulo: 'Workshop de React Avanzado',
    descripcion: 'Aprende patrones avanzados de React, performance y arquitectura de gran escala.',
    fecha: '2026-03-20',
    hora: '14:00',
    ubicacion: 'Sala A',
    organizador: 'DevCommunity'
  },
  {
    id: 3,
    titulo: 'Hackathon de Innovación',
    descripcion: '48 horas para crear soluciones innovadoras. Premios increíbles para los ganadores.',
    fecha: '2026-04-10',
    hora: '18:00',
    ubicacion: 'Campus Universitario',
    organizador: 'InnovateHub'
  }
];

const EventCard = ({ evento }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
      {evento.titulo}
    </h3>
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', flex: 1 }}>
      {evento.descripcion}
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={16} className="text-accent" />
        <span>{evento.fecha} • {evento.hora}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={16} />
        <span>{evento.ubicacion}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={16} />
        <span>{evento.organizador}</span>
      </div>
    </div>

    <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
      Ver Detalles
    </button>
  </div>
);

const EventsPage = () => {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="animate-fade-in">
        <h1 style={{ marginBottom: '2rem' }}>Próximos Eventos</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {EVENTS_MOCK.map(evento => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
