
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash, Info, CheckCircle, XCircle } from 'lucide-react';

export default function RoomManagerPage() {
    const [salas, setSalas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sal_nombre: '',
        sal_descripcion: '',
        sal_estado: true
    });
    const [editingId, setEditingId] = useState(null);

    const fetchSalas = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/api/salas', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSalas(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    const handleCreate = () => {
        setFormData({ sal_nombre: '', sal_descripcion: '', sal_estado: true });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (s) => {
        setFormData({
            sal_nombre: s.sal_nombre,
            sal_descripcion: s.sal_descripcion,
            sal_estado: s.sal_estado
        });
        setEditingId(s.sal_id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta sala?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/sala?sal_id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 409) {
                const data = await res.json();
                alert(data.message || "No se puede eliminar porque tiene eventos asignados.");
                return;
            }

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Error al eliminar");
                return;
            }

            fetchSalas();
        } catch (error) {
            console.error(error);
            alert("Error de conexión al eliminar.");
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? 'http://localhost:3000/api/sala'
                : 'http://localhost:3000/api/sala';

            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, sal_id: editingId } : formData;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            setIsModalOpen(false);
            fetchSalas();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="animate-fade-in">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Gestión de Salas</h1>
                        <p className="page-subtitle">Administra todas las salas disponibles</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={20} /> Nueva Sala
                    </button>
                </div>

                {salas.length === 0 ? (
                    <div className="empty-state">
                        <MapPin size={64} style={{ opacity: 0.3 }} />
                        <h3>No hay salas registradas</h3>
                        <p>Comienza agregando tu primera sala</p>
                        <button className="btn btn-primary" onClick={handleCreate}>
                            <Plus size={20} /> Crear Sala
                        </button>
                    </div>
                ) : (
                    <div className="table-container glass-panel">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th className="actions-column">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salas.map(s => (
                                    <tr key={s.sal_id}>
                                        <td className="id-cell">#{s.sal_id}</td>
                                        <td className="title-cell">{s.sal_nombre}</td>
                                        <td className="description-cell">{s.sal_descripcion}</td>
                                        <td>
                                            <div className="cell-with-icon">
                                                {s.sal_estado ? (
                                                    <>
                                                        <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                                                        <span style={{ color: 'var(--color-success)' }}>Disponible</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={16} style={{ color: 'var(--color-danger)' }} />
                                                        <span style={{ color: 'var(--color-danger)' }}>No Disponible</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-action btn-action-edit"
                                                    onClick={() => handleEdit(s)}
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn-action btn-action-delete"
                                                    onClick={() => handleDelete(s.sal_id)}
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
                        <h2>{editingId ? 'Editar Sala' : 'Nueva Sala'}</h2>

                        <div className="form-group">
                            <label>Nombre de la Sala</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.sal_nombre}
                                onChange={e => setFormData({ ...formData, sal_nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Descripción</label>
                            <textarea
                                className="input-field"
                                value={formData.sal_descripcion}
                                onChange={e => setFormData({ ...formData, sal_descripcion: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.sal_estado}
                                    onChange={e => setFormData({ ...formData, sal_estado: e.target.checked })}
                                />
                                Sala Disponible
                            </label>
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
