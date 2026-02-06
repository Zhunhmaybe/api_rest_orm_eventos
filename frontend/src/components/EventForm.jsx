
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableParticipant } from './SortableParticipant';
import { Users, Plus, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

function Droppable({ id, children, className }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={className} id={id}>
      {children}
    </div>
  );
}

export default function EventForm({ onClose, onSave, initialData }) {
  // Lists state
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Drag state
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // If Editing, pre-fill
    if (initialData) {
      setTitle(initialData.titulo || '');
      setCost(initialData.precio || '');
      if (initialData.sal_id) setSelectedSala(initialData.sal_id);
    }
  }, [initialData]);

  useEffect(() => {
    // Fetch Participants
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

    // Fetch Salas
    fetch('http://localhost:3000/salas')
      .then(res => res.json())
      .then(data => {
        setSalas(data);
        if (!initialData && data.length > 0) setSelectedSala(data[0].sal_id);
      })
      .catch(err => console.error("Error fetching salas:", err));
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Find source and destination containers
    const sourceList = availableParticipants.find(p => p.id === active.id) ? 'available' : 'event';
    const destList = (over.id === 'event-list-droppable' || eventParticipants.find(p => p.id === over.id)) ? 'event' : 'available';

    if (sourceList === destList) {
      // Reorder in same list
      if (active.id !== over.id) {
        if (sourceList === 'available') {
          setAvailableParticipants((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        } else {
          setEventParticipants((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }
    } else {
      // Move between lists
      if (sourceList === 'available') {
        const item = availableParticipants.find(p => p.id === active.id);
        if (item) {
          setAvailableParticipants(items => items.filter(p => p.id !== active.id));
          setEventParticipants(items => [...items, item]);
        }
      } else {
        const item = eventParticipants.find(p => p.id === active.id);
        if (item) {
          setEventParticipants(items => items.filter(p => p.id !== active.id));
          setAvailableParticipants(items => [...items, item]);
        }
      }
    }

    setActiveId(null);
  }

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

      const res = await fetch(`${url}?${queryParams}`, {
        method: method
      });

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

      onSave(); // Refresh parent
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(availableParticipants.length / itemsPerPage);
  const currentParticipants = availableParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="modal-backdrop">
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="list-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><Users size={16} /> Disponibles</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{availableParticipants.length} total</span>
              </div>

              <Droppable id="available-list-droppable" className="droppable-area" style={{ minHeight: '300px' }}>
                <SortableContext
                  items={currentParticipants}
                  strategy={verticalListSortingStrategy}
                >
                  {currentParticipants.map(p => (
                    <SortableParticipant key={p.id} id={p.id} name={p.name} />
                  ))}
                </SortableContext>
              </Droppable>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.1rem' }}>
                  <button
                    className="btn-icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="btn-icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="list-separator"><Plus /></div>

            <div className="list-container highlight">
              <h3>Participantes del Evento</h3>
              <Droppable id="event-list-droppable" className="droppable-area" style={{ minHeight: '350px' }}>
                <SortableContext
                  items={eventParticipants}
                  strategy={verticalListSortingStrategy}
                >
                  {eventParticipants.map(p => (
                    <SortableParticipant key={p.id} id={p.id} name={p.name} onRemove={(id) => {
                      const item = eventParticipants.find(x => x.id === id);
                      setEventParticipants(prev => prev.filter(x => x.id !== id));
                      setAvailableParticipants(prev => [...prev, item]);
                    }} />
                  ))}
                  {eventParticipants.length === 0 && (
                    <div className="empty-placeholder">Arrastra participantes aquí</div>
                  )}
                </SortableContext>
              </Droppable>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="participant-item glass-panel dragging">
                  <GripVertical size={16} />
                  {[...availableParticipants, ...eventParticipants].find(p => p.id === activeId)?.name}
                </div>
              ) : null}
            </DragOverlay>

          </DndContext>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSaveInternal}>Guardar Evento</button>
        </div>
      </div>
    </div>
  );
}
