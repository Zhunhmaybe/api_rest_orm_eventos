
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Edit, Trash } from 'lucide-react';
import EventForm from '../components/EventForm';

export default function EventManagerPage() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = () => {
        fetch('http://localhost:3000/eventos')
            .then(res => res.json())
            .then(data => {
                // Formatting API response to match UI needs
                // API keys: eve_id, eve_nombre, eve_costo, sal_id
                // We'll map them appropriately.
                // Note: Missing date/description/location details in simple GET /eventos
                // We will default them for now.
                const formatted = data.map(e => ({
                    id: e.eve_id,
                    titulo: e.eve_nombre,
                    descripcion: e.eve_costo ? `Costo: $${e.eve_costo}` : 'Sin costo especificado',
                    fecha: '2026', // Placeholder as DB doesn't have date
                    ubicacion: `Sala ${e.sal_id || 'Principal'}`,
                    participantes: '?' // Count not available in simple list
                }));
                setEvents(formatted);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = () => {
        setIsModalOpen(true);
    };

    const handleSaveEvent = () => {
        setIsModalOpen(false);
        fetchEvents(); // Refresh list
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
                    
                    {events.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            No hay eventos registrados.
                        </div>
                    )}
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
