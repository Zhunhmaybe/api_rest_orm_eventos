
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash, Mail, Key } from 'lucide-react';

export default function ParticipantManagerPage() {
    const [participants, setParticipants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        par_cedula: '',
        par_nombre: '',
        par_correo: ''
    });
    const [editingId, setEditingId] = useState(null);

    const fetchParticipants = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/api/participantes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setParticipants(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const handleCreate = () => {
        setFormData({ par_cedula: '', par_nombre: '', par_correo: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (p) => {
        setFormData({
            par_cedula: p.par_cedula,
            par_nombre: p.par_nombre,
            par_correo: p.par_correo
        });
        setEditingId(p.par_id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este participante?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/participante?par_id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 409) {
                const data = await res.json();
                alert(data.message || "No se puede eliminar porque está inscrito en eventos.");
                return;
            }

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Error al eliminar");
                return;
            }

            fetchParticipants();
        } catch (error) {
            console.error(error);
            alert("Error de conexión al eliminar.");
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? 'http://localhost:3000/api/participante'
                : 'http://localhost:3000/api/participante';

            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, par_id: editingId } : formData;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            setIsModalOpen(false);
            fetchParticipants();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Gestión de Participantes</h1>
                        <p className="page-subtitle">Administra todos los participantes registrados</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={20} /> Nuevo Participante
                    </button>
                </div>

                {participants.length === 0 ? (
                    <div className="empty-state">
                        <Users size={64} style={{ opacity: 0.3 }} />
                        <h3>No hay participantes registrados</h3>
                        <p>Comienza agregando tu primer participante</p>
                        <button className="btn btn-primary" onClick={handleCreate}>
                            <Plus size={20} /> Crear Participante
                        </button>
                    </div>
                ) : (
                    <div className="table-container glass-panel">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Cédula</th>
                                    <th>Correo Electrónico</th>
                                    <th className="actions-column">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map(p => (
                                    <tr key={p.par_id}>
                                        <td className="id-cell">#{p.par_id}</td>
                                        <td className="title-cell">{p.par_nombre}</td>
                                        <td>
                                            <div className="cell-with-icon">
                                                <Key size={16} />
                                                <span>{p.par_cedula}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-with-icon">
                                                <Mail size={16} />
                                                <span>{p.par_correo}</span>
                                            </div>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-action btn-action-edit"
                                                    onClick={() => handleEdit(p)}
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn-action btn-action-delete"
                                                    onClick={() => handleDelete(p.par_id)}
                                                    title="Eliminar"
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
                <div className="modal-backdrop">
                    <div className="modal-content glass-panel animate-fade-in">
                        <h2>{editingId ? 'Editar Participante' : 'Nuevo Participante'}</h2>

                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.par_nombre}
                                onChange={e => setFormData({ ...formData, par_nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Cédula</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.par_cedula}
                                onChange={e => setFormData({ ...formData, par_cedula: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                className="input-field"
                                value={formData.par_correo}
                                onChange={e => setFormData({ ...formData, par_correo: e.target.value })}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
