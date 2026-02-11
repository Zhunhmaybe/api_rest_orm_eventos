
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableParticipant } from './SortableParticipant';
import { Users, Plus, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import UpgradeModal from './UpgradeModal';

export default function EventForm({ onClose, onSave, initialData }) {
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.titulo || '');
      setCost(initialData.precio || '');
      if (initialData.sal_id) setSelectedSala(initialData.sal_id);
    } else {
      // Show upgrade modal for new events
      setShowUpgradeModal(true);
    }
  }, [initialData]);

  useEffect(() => {
    fetch('http://localhost:3000/participantes')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          id: p.par_id,
          name: p.par_nombre,
          ...p
        }));
        setAvailableParticipants(formatted);
      })
      .catch(err => console.error("Error fetching participants:", err));

    fetch('http://localhost:3000/salas')
      .then(res => res.json())
      .then(data => {
        setSalas(data);
        if (!initialData && data.length > 0) setSelectedSala(data[0].sal_id);
      })
      .catch(err => console.error("Error fetching salas:", err));
  }, [initialData]);

  // DnD sensors — only used for reordering within the event list
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEventParticipants((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  // Transfer handlers
  const addToEvent = (participant) => {
    setAvailableParticipants(prev => prev.filter(p => p.id !== participant.id));
    setEventParticipants(prev => [...prev, participant]);
  };

  const removeFromEvent = (id) => {
    const item = eventParticipants.find(p => p.id === id);
    if (item) {
      setEventParticipants(prev => prev.filter(p => p.id !== id));
      setAvailableParticipants(prev => [...prev, item]);
    }
  };

  const addAllToEvent = () => {
    setEventParticipants(prev => [...prev, ...filteredParticipants]);
    setAvailableParticipants(prev => prev.filter(p => !filteredParticipants.includes(p)));
    setSearchTerm('');
  };

  const removeAllFromEvent = () => {
    setAvailableParticipants(prev => [...prev, ...eventParticipants]);
    setEventParticipants([]);
  };

  const handleSaveInternal = async () => {
    try {
      const isEditing = !!initialData;
      const url = 'http://localhost:3000/evento';
      const method = isEditing ? 'PUT' : 'POST';

      const queryParams = new URLSearchParams({
        eve_nombre: title,
        eve_costo: cost || 0,
        sal_id: selectedSala
      });

      if (isEditing) {
        queryParams.append('eve_id', initialData.id);
      }

      const res = await fetch(`${url}?${queryParams}`, { method });

      let newEventId;
      if (isEditing) {
        newEventId = initialData.id;
      } else {
        const createdEvent = await res.json();
        newEventId = createdEvent.eve_id || createdEvent?.body?.evento?.response?.eve_id || createdEvent?.id;
      }

      if (newEventId && eventParticipants.length > 0) {
        for (const p of eventParticipants) {
          const pParams = new URLSearchParams({
            eve_id: newEventId,
            par_id: p.id,
            evepar_cantidad: 1
          });
          try {
            await fetch(`http://localhost:3000/evento/participante?${pParams}`, {
              method: 'POST'
            });
          } catch (e) {
            console.log("Participant likely already assigned", e);
          }
        }
      }

      onSave();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // Filter + paginate available participants
  const filteredParticipants = availableParticipants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const currentParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="modal-backdrop">
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      <div className="modal-content glass-panel animate-fade-in">
        <h2>{initialData ? 'Editar Evento' : 'Nuevo Evento'}</h2>

        <div className="form-group">
          <label>Título del Evento</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ej. Conferencia 2026"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label>Costo del Evento</label>
          <input
            type="number"
            className="input-field"
            placeholder="0.00"
            value={cost}
            onChange={e => setCost(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label>Sala</label>
          <select
            className="input-field"
            value={selectedSala}
            onChange={e => setSelectedSala(e.target.value)}
          >
            <option value="">-- Seleccionar Sala --</option>
            {salas.map(s => (
              <option key={s.sal_id} value={s.sal_id}>{s.sal_nombre} ({s.sal_estado ? 'Disponible' : 'Ocupada'})</option>
            ))}
          </select>
        </div>

        <div className="drag-section">
          {/* Available Participants */}
          <div className="list-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><Users size={16} /> Disponibles</h3>
              <span className="list-counter">{availableParticipants.length} total</span>
            </div>

            {/* Search */}
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar participante..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="available-list">
              {currentParticipants.length === 0 ? (
                <div className="empty-placeholder">
                  {searchTerm ? 'Sin resultados' : 'No hay participantes disponibles'}
                </div>
              ) : (
                currentParticipants.map(p => (
                  <div key={p.id} className="transfer-item" onClick={() => addToEvent(p)}>
                    <div className="transfer-item-avatar">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="transfer-item-name">{p.name}</span>
                    <ArrowRight size={16} className="transfer-item-arrow" />
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="btn-icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="pagination-text">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="btn-icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Bulk action */}
            {filteredParticipants.length > 0 && (
              <button className="btn-transfer-all" onClick={addAllToEvent}>
                Agregar todos <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Center arrows */}
          <div className="list-separator">
            <Plus />
          </div>

          {/* Event Participants — sortable with dnd-kit */}
          <div className="list-container highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Participantes del Evento</h3>
              <span className="list-counter">{eventParticipants.length} asignados</span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={eventParticipants}
                strategy={verticalListSortingStrategy}
              >
                <div className="droppable-area">
                  {eventParticipants.map(p => (
                    <SortableParticipant
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      onRemove={removeFromEvent}
                    />
                  ))}
                  {eventParticipants.length === 0 && (
                    <div className="empty-placeholder">
                      Haz clic en un participante disponible para agregarlo
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>

            {eventParticipants.length > 0 && (
              <button className="btn-transfer-all btn-transfer-all-remove" onClick={removeAllFromEvent}>
                <ArrowLeft size={14} /> Quitar todos
              </button>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSaveInternal}>Guardar Evento</button>
        </div>
      </div>
    </div>
  );
}
