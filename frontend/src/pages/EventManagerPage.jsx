
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Edit, Trash, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';

export default function EventManagerPage() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();

    const fetchEvents = () => {
        fetch('http://localhost:3000/eventos')
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(e => ({
                    id: e.eve_id,
                    titulo: e.eve_nombre,
                    precio: e.eve_costo,
                    descripcion: e.eve_costo ? `Costo: $${e.eve_costo}` : 'Sin costo especificado',
                    fecha: '2026',
                    ubicacion: `Sala ${e.sal_id || 'Principal'}`,
                    sal_id: e.sal_id,
                    participantes: '?'
                }));
                setEvents(formatted);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm("¿Seguro que quieres eliminar este evento?")) return;

        try {
            await fetch(`http://localhost:3000/evento?eve_id=${id}`, {
                method: 'DELETE'
            });
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleSaveEvent = () => {
        setIsModalOpen(false);
        fetchEvents();
    };

    const handleManageParticipants = (eventId, eventName) => {
        navigate(`/eventos/${eventId}/participantes`, { state: { eventName } });
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Gestión de Eventos</h1>
                        <p className="page-subtitle">Administra todos tus eventos en un solo lugar</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateEvent}>
                        <Plus size={20} /> Nuevo Evento
                    </button>
                </div>

                {events.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} style={{ opacity: 0.3 }} />
                        <h3>No hay eventos registrados</h3>
                        <p>Comienza creando tu primer evento</p>
                        <button className="btn btn-primary" onClick={handleCreateEvent}>
                            <Plus size={20} /> Crear Evento
                        </button>
                    </div>
                ) : (
                    <div className="table-container glass-panel">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Evento</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                    <th>Ubicación</th>
                                    <th>Participantes</th>
                                    <th className="actions-column">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(evento => (
                                    <tr key={evento.id}>
                                        <td className="id-cell">#{evento.id}</td>
                                        <td className="title-cell">{evento.titulo}</td>
                                        <td className="description-cell">{evento.descripcion}</td>
                                        <td>
                                            <div className="cell-with-icon">
                                                <Calendar size={16} />
                                                <span>{evento.fecha}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-with-icon">
                                                <MapPin size={16} />
                                                <span>{evento.ubicacion}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-with-icon">
                                                <Users size={16} />
                                                <span>{evento.participantes}</span>
                                            </div>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-action btn-action-primary"
                                                    title="Gestionar Participantes"
                                                    onClick={() => handleManageParticipants(evento.id, evento.titulo)}
                                                >
                                                    <UserPlus size={16} />
                                                </button>
                                                <button
                                                    className="btn-action btn-action-edit"
                                                    title="Editar"
                                                    onClick={() => handleEditEvent(evento)}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn-action btn-action-delete"
                                                    title="Eliminar"
                                                    onClick={() => handleDeleteEvent(evento.id)}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <EventForm
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEvent}
                    initialData={editingEvent}
                />
            )}
        </div>
    );
}
