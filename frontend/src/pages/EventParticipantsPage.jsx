import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, Trash, Home, ArrowRight } from 'lucide-react';

export default function EventParticipantsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const eventName = location.state?.eventName || 'Evento';

    const [eventParticipants, setEventParticipants] = useState([]);
    const [allParticipants, setAllParticipants] = useState([]);
    const [availableParticipants, setAvailableParticipants] = useState([]);
    const [draggedParticipant, setDraggedParticipant] = useState(null);
    const [isDragOverDrop, setIsDragOverDrop] = useState(false);
    const dropZoneRef = useRef(null);

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

    const handleDragStart = (e, participant) => {
        setDraggedParticipant(participant);
        const el = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', participant.par_id);

        requestAnimationFrame(() => {
            el.classList.add('is-dragging');
        });
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('is-dragging');
        setDraggedParticipant(null);
        setIsDragOverDrop(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragOverDrop(true);
    };

    const handleDragLeave = (e) => {
        if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
            setIsDragOverDrop(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOverDrop(false);
        if (draggedParticipant) {
            handleAddParticipant(draggedParticipant.par_id);
            setDraggedParticipant(null);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
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

                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            <Users size={32} style={{ marginRight: '0.5rem' }} />
                            Participantes de: {eventName}
                        </h1>
                        <p className="page-subtitle">Gestiona los participantes de este evento — arrastra o haz clic para agregar</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/eventos')}>
                        <ArrowLeft size={20} /> Volver a Eventos
                    </button>
                </div>

                <div className="participants-manager">
                    <div className="glass-panel participants-panel">
                        <h3 className="panel-title">
                            <UserPlus size={20} />
                            Participantes Disponibles ({availableParticipants.length})
                        </h3>
                        <p className="panel-subtitle">Arrastra o haz clic en el botón para agregar al evento</p>

                        <div className="participants-list">
                            {availableParticipants.length === 0 ? (
                                <div className="empty-placeholder">
                                    Todos los participantes ya están en este evento
                                </div>
                            ) : (
                                availableParticipants.map(participant => (
                                    <div
                                        key={participant.par_id}
                                        className={`participant-item ${draggedParticipant?.par_id === participant.par_id ? 'is-dragging' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, participant)}
                                        onDragEnd={handleDragEnd}
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
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div
                        ref={dropZoneRef}
                        className={`glass-panel participants-panel drop-zone ${isDragOverDrop ? 'drop-zone-active' : ''}`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <h3 className="panel-title">
                            <Users size={20} />
                            En el Evento ({eventParticipants.length})
                        </h3>
                        <p className="panel-subtitle">Participantes registrados en este evento</p>

                        <div className="participants-list">
                            {eventParticipants.length === 0 ? (
                                <div className={`empty-placeholder ${isDragOverDrop ? 'empty-placeholder-active' : ''}`}>
                                    No hay participantes en este evento.<br />
                                    Arrastra participantes aquí o usa el botón.
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
