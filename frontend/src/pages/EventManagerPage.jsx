
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Edit, Trash } from 'lucide-react';
import EventForm from '../components/EventForm';

const INITIAL_EVENTS = [
    {
      id: 1,
      titulo: 'Tech Conference 2026',
      descripcion: 'El evento más importante de tecnología del año.',
      fecha: '2026-03-15',
      ubicacion: 'Centro de Convenciones',
      participantes: 120
    },
    {
      id: 2,
      titulo: 'Workshop de React Avanzado',
      descripcion: 'Aprende patrones avanzados de React.',
      fecha: '2026-03-20',
      ubicacion: 'Sala A',
      participantes: 25
    }
];

export default function EventManagerPage() {
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateEvent = () => {
        setIsModalOpen(true);
    };

    const handleSaveEvent = (eventData) => {
        // Here we would save to API
        console.log("Saving event:", eventData);
        // Mock add
        setEvents([...events, {
            id: Date.now(),
            titulo: 'Nuevo Evento Interactiva',
            descripcion: 'Descripción generada',
            fecha: '2026-12-01',
            ubicacion: 'TBD',
            participantes: 0
        }]);
        setIsModalOpen(false);
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Gestión de Eventos</h1>
                    <button className="btn btn-primary" onClick={handleCreateEvent}>
                        <Plus size={20} /> Nuevo Evento
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {events.map(evento => (
                         <div key={evento.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{evento.titulo}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" title="Editar"><Edit size={16} /></button>
                                    <button className="btn-icon" title="Eliminar"><Trash size={16} /></button>
                                </div>
                            </div>
                            
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', flex: 1 }}>
                                {evento.descripcion}
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} className="text-accent" />
                                    <span>{evento.fecha}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{evento.ubicacion}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} />
                                    <span>{evento.participantes} Participantes</span>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <EventForm 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveEvent}
                />
            )}
        </div>
    );
}
