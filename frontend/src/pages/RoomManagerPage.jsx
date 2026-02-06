
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
        fetch('http://localhost:3000/salas')
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
            const res = await fetch(`http://localhost:3000/sala?sal_id=${id}`, {
                method: 'DELETE'
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
            const url = editingId 
                ? 'http://localhost:3000/sala' 
                : 'http://localhost:3000/sala';
            
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, sal_id: editingId } : formData;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Gestión de Salas</h1>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={20} /> Nueva Sala
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {salas.map(s => (
                         <div key={s.sal_id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{s.sal_nombre}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => handleEdit(s)} title="Editar"><Edit size={16} /></button>
                                    <button className="btn-icon" onClick={() => handleDelete(s.sal_id)} title="Eliminar"><Trash size={16} /></button>
                                </div>
                            </div>
                            
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', flex: 1 }}>
                                {s.sal_descripcion}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {s.sal_estado ? <CheckCircle size={16} className="text-accent" /> : <XCircle size={16} color="red" />}
                                    <span>{s.sal_estado ? 'Disponible' : 'No Disponible'}</span>
                                </div>
                            </div>
                         </div>
                    ))}

                    {salas.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            No hay salas registradas.
                        </div>
                    )}
                </div>
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
                                onChange={e => setFormData({...formData, sal_nombre: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Descripción</label>
                            <textarea 
                                className="input-field" 
                                value={formData.sal_descripcion}
                                onChange={e => setFormData({...formData, sal_descripcion: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                    type="checkbox"
                                    checked={formData.sal_estado}
                                    onChange={e => setFormData({...formData, sal_estado: e.target.checked})}
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
