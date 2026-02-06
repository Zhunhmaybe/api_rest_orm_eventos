
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
        fetch('http://localhost:3000/participantes')
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
            const res = await fetch(`http://localhost:3000/participante?par_id=${id}`, {
                method: 'DELETE'
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
            const url = editingId 
                ? 'http://localhost:3000/participante' 
                : 'http://localhost:3000/participante';
            
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, par_id: editingId } : formData;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Gestión de Participantes</h1>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={20} /> Nuevo Participante
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {participants.map(p => (
                         <div key={p.par_id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{p.par_nombre}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => handleEdit(p)} title="Editar"><Edit size={16} /></button>
                                    <button className="btn-icon" onClick={() => handleDelete(p.par_id)} title="Eliminar"><Trash size={16} /></button>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Key size={16} className="text-accent" />
                                    <span>CI: {p.par_cedula}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} />
                                    <span>{p.par_correo}</span>
                                </div>
                            </div>
                         </div>
                    ))}
                    
                    {participants.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            No hay participantes registrados.
                        </div>
                    )}
                </div>
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
                                onChange={e => setFormData({...formData, par_nombre: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Cédula</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={formData.par_cedula}
                                onChange={e => setFormData({...formData, par_cedula: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="input-field" 
                                value={formData.par_correo}
                                onChange={e => setFormData({...formData, par_correo: e.target.value})}
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
