import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, UserCheck, UserPlus, LogOut, Search, Clock, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ParticipantEventsPage() {
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [view, setView] = useState('available');
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableEvents();
        fetchMyEvents();
    }, []);

    const fetchAvailableEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/eventos');
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const fetchMyEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/participante-eventos?par_id=${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMyEvents(data);
        } catch (error) {
            console.error('Error fetching my events:', error);
        }
    };

    const handleSubscribe = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:3000/api/evento/participante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eve_id: eventId,
                    par_id: user.id
                })
            });
            fetchMyEvents();
            alert('¡Te has inscrito al evento exitosamente!');
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Error al inscribirse');
        }
    };

    const handleUnsubscribe = async (eventId) => {
        if (!confirm('¿Seguro que deseas cancelar tu inscripción?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3000/api/evento/participante?eve_id=${eventId}&par_id=${user.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMyEvents();
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    };

    const isSubscribed = (eventId) => {
        return myEvents.some(me => me.eve_id === eventId);
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                {/* Header Section */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Portal del Participante</h1>
                        <p className="page-subtitle">Bienvenido, {user.nombre}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={logout}>
                        <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                        Cerrar Sesión
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setView('available')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            background: view === 'available' ? 'var(--color-primary)' : 'transparent',
                            color: view === 'available' ? 'white' : 'var(--color-text-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <Search size={18} />
                        Explorar Eventos
                    </button>
                    <button
                        onClick={() => setView('subscribed')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            background: view === 'subscribed' ? 'var(--color-primary)' : 'transparent',
                            color: view === 'subscribed' ? 'white' : 'var(--color-text-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <Activity size={18} />
                        Mis Inscripciones
                        {myEvents.length > 0 && (
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                marginLeft: '0.5rem'
                            }}>{myEvents.length}</span>
                        )}
                    </button>
                </div>

                {/* Content Area */}
                {view === 'available' && (
                    <div className="events-grid animate-fade-in">
                        {events.map(event => {
                            const subscribed = isSubscribed(event.eve_id);
                            return (
                                <div key={event.eve_id} className="event-card">
                                    <div className="event-card-header">
                                        <h3 className="event-card-title">{event.eve_nombre}</h3>
                                        {subscribed && <span className="event-card-badge">Inscrito</span>}
                                    </div>
                                    <div className="event-card-content">
                                        <div className="event-info-row">
                                            <MapPin size={18} className="event-info-icon" />
                                            <span>Sala {event.sal_id}</span>
                                        </div>
                                        <div className="event-info-row">
                                            <DollarSign size={18} className="event-info-icon" />
                                            <span>{event.eve_costo ? `$${event.eve_costo}` : 'Gratis'}</span>
                                        </div>
                                        <div className="event-info-row">
                                            <UserPlus size={18} className="event-info-icon" />
                                            <span>{event.cantidad_participantes || 0} asistentes</span>
                                        </div>
                                    </div>
                                    <div className="event-card-footer">
                                        {subscribed ? (
                                            <button className="btn btn-secondary btn-full" disabled style={{ opacity: 0.7 }}>
                                                <UserCheck size={18} />
                                                Ya estás inscrito
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-full"
                                                onClick={() => handleSubscribe(event.eve_id)}
                                            >
                                                <UserPlus size={18} />
                                                Inscribirse
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {events.length === 0 && !loading && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                                <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No hay eventos disponibles en este momento.</p>
                            </div>
                        )}
                    </div>
                )}

                {view === 'subscribed' && (
                    <div className="events-grid animate-fade-in">
                        {myEvents.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                                <UserPlus size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <h3>No tienes inscripciones activas</h3>
                                <p style={{ marginBottom: '1.5rem' }}>Explora los eventos disponibles y únete a los que más te interesen.</p>
                                <button className="btn btn-primary" onClick={() => setView('available')}>
                                    Ver Eventos Disponibles
                                </button>
                            </div>
                        ) : (
                            myEvents.map((event, index) => (
                                <div key={index} className="event-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
                                    <div className="event-card-header">
                                        <h3 className="event-card-title">{event.eve_nombre}</h3>
                                        <span className="event-card-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Confirmado</span>
                                    </div>
                                    <div className="event-card-content">
                                        <div className="event-info-row">
                                            <MapPin size={18} className="event-info-icon" />
                                            <span>{event.sal_nombre || 'Sala por confirmar'}</span>
                                        </div>
                                        <div className="event-info-row">
                                            <DollarSign size={18} className="event-info-icon" />
                                            <span>Inversión: ${event.eve_costo}</span>
                                        </div>
                                    </div>
                                    <div className="event-card-footer">
                                        <button
                                            className="btn btn-danger btn-full"
                                            onClick={() => handleUnsubscribe(event.eve_id)}
                                        >
                                            <LogOut size={18} />
                                            Cancelar Inscripción
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
