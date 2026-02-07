import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, Trash, Home } from 'lucide-react';

export default function EventParticipantsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const eventName = location.state?.eventName || 'Evento';

    const [eventParticipants, setEventParticipants] = useState([]);
    const [allParticipants, setAllParticipants] = useState([]);
    const [availableParticipants, setAvailableParticipants] = useState([]);
    const [draggedParticipant, setDraggedParticipant] = useState(null);

    useEffect(() => {
        fetchEventParticipants();
        fetchAllParticipants();
    }, [eventId]);

    const fetchEventParticipants = async () => {
        try {
            const response = await fetch(`http://localhost:3000/evento/${eventId}/participantes`);
            const data = await response.json();
            setEventParticipants(data);
        } catch (error) {
            console.error('Error fetching event participants:', error);
            setEventParticipants([]);
        }
    };

    const fetchAllParticipants = async () => {
        try {
            const response = await fetch('http://localhost:3000/participantes');
            const data = await response.json();
            setAllParticipants(data);
        } catch (error) {
            console.error('Error fetching all participants:', error);
        }
    };

    useEffect(() => {
        // Filter out participants already in the event
        const eventParticipantIds = eventParticipants.map(p => p.par_id);
        const available = allParticipants.filter(p => !eventParticipantIds.includes(p.par_id));
        setAvailableParticipants(available);
    }, [eventParticipants, allParticipants]);

    const handleAddParticipant = async (participantId) => {
        try {
            await fetch('http://localhost:3000/evento/participante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eve_id: parseInt(eventId),
                    par_id: participantId
                })
            });
            fetchEventParticipants();
        } catch (error) {
            console.error('Error adding participant:', error);
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        if (!confirm('¿Seguro que quieres eliminar este participante del evento?')) return;

        try {
            await fetch(`http://localhost:3000/evento/participante?eve_id=${eventId}&par_id=${participantId}`, {
                method: 'DELETE'
            });
            fetchEventParticipants();
        } catch (error) {
            console.error('Error removing participant:', error);
        }
    };

    const handleDragStart = (participant) => {
        setDraggedParticipant(participant);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedParticipant) {
            handleAddParticipant(draggedParticipant.par_id);
            setDraggedParticipant(null);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">
                        <Home size={16} />
                        Inicio
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/eventos" className="breadcrumb-link">
                        Eventos
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Participantes</span>
                </div>

                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            <Users size={32} style={{ marginRight: '0.5rem' }} />
                            Participantes de: {eventName}
                        </h1>
                        <p className="page-subtitle">Gestiona los participantes de este evento</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/eventos')}>
                        <ArrowLeft size={20} /> Volver a Eventos
                    </button>
                </div>

                {/* Drag and Drop Section */}
                <div className="participants-manager">
                    {/* Available Participants */}
                    <div className="glass-panel participants-panel">
                        <h3 className="panel-title">
                            <UserPlus size={20} />
                            Participantes Disponibles ({availableParticipants.length})
                        </h3>
                        <p className="panel-subtitle">Arrastra participantes a la derecha para agregarlos al evento</p>

                        <div className="participants-list">
                            {availableParticipants.length === 0 ? (
                                <div className="empty-placeholder">
                                    Todos los participantes ya están en este evento
                                </div>
                            ) : (
                                availableParticipants.map(participant => (
                                    <div
                                        key={participant.par_id}
                                        className="participant-item"
                                        draggable
                                        onDragStart={() => handleDragStart(participant)}
                                    >
                                        <div className="participant-avatar">
                                            {participant.par_nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="participant-info">
                                            <div className="participant-name">{participant.par_nombre}</div>
                                            <div className="participant-email">{participant.par_email}</div>
                                        </div>
                                        <button
                                            className="btn-action btn-action-primary"
                                            onClick={() => handleAddParticipant(participant.par_id)}
                                            title="Agregar al evento"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Event Participants */}
                    <div
                        className="glass-panel participants-panel drop-zone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <h3 className="panel-title">
                            <Users size={20} />
                            En el Evento ({eventParticipants.length})
                        </h3>
                        <p className="panel-subtitle">Participantes registrados en este evento</p>

                        <div className="participants-list">
                            {eventParticipants.length === 0 ? (
                                <div className="empty-placeholder">
                                    No hay participantes en este evento.<br />
                                    Arrastra participantes aquí para agregarlos.
                                </div>
                            ) : (
                                eventParticipants.map(participant => (
                                    <div
                                        key={participant.par_id}
                                        className="participant-item participant-item-active"
                                    >
                                        <div className="participant-avatar participant-avatar-active">
                                            {participant.par_nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="participant-info">
                                            <div className="participant-name">{participant.par_nombre}</div>
                                            <div className="participant-email">{participant.par_email}</div>
                                        </div>
                                        <button
                                            className="btn-action btn-action-delete"
                                            onClick={() => handleRemoveParticipant(participant.par_id)}
                                            title="Eliminar del evento"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
