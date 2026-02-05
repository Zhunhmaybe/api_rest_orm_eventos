
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
import { Users, Plus, GripVertical } from 'lucide-react';

function Droppable({ id, children, className }) {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} className={className} id={id}>
      {children}
    </div>
  );
}

export default function EventForm({ onClose, onSave }) {
  // Lists state
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  
  // Drag state
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/participantes')
        .then(res => res.json())
        .then(data => {
            // Map API data to component format if needed, but it matches par_id/par_nombre mostly
            // Sortable expects 'id' as string/number.
            const formatted = data.map(p => ({
                id: p.par_id,
                name: p.par_nombre,
                // keep original for later usage
                ...p 
            }));
            setAvailableParticipants(formatted);
        })
        .catch(err => console.error("Error fetching participants:", err));
  }, []);

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
        // 1. Create Event
        // Using query params as per controller implementation: req.query
        const queryParams = new URLSearchParams({
            eve_nombre: title,
            eve_costo: cost || 0,
            sal_id: 1 // Default Sala ID for now or fetch list
        });
        
        const res = await fetch(`http://localhost:3000/evento?${queryParams}`, {
            method: 'POST'
        });
        const createdEvent = await res.json();
        
        // Ensure we handle the Sequelize response structure (might be wrapped)
        const newEventId = createdEvent.eve_id || createdEvent?.body?.evento?.response?.eve_id || createdEvent?.id ; 
        
        if (!newEventId) {
            console.warn("Could not extract new Event ID", createdEvent);
            // Fallback or alert if id missing, but let's proceed if possible or just refresh
        }

        // 2. Assign Participants
        // API: POST /evento/participante?eve_id=X&par_id=Y&evepar_cantidad=1
        if (newEventId && eventParticipants.length > 0) {
            for (const p of eventParticipants) {
                const pParams = new URLSearchParams({
                    eve_id: newEventId,
                    par_id: p.id,
                    evepar_cantidad: 1 // Default quantity
                });
                await fetch(`http://localhost:3000/evento/participante?${pParams}`, {
                     method: 'POST'
                });
            }
        }

        onSave(); // Refresh parent
    } catch (error) {
        console.error("Error saving event:", error);
    }
  };

  return (
    <div className="modal-backdrop">
       <div className="modal-content glass-panel animate-fade-in">
          <h2>Nuevo Evento</h2>
          
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

          <div className="drag-section">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="list-container">
                <h3><Users size={16} /> Disponibles</h3>
                <Droppable id="available-list-droppable" className="droppable-area">
                  <SortableContext 
                    items={availableParticipants}
                    strategy={verticalListSortingStrategy}
                  >
                    {availableParticipants.map(p => (
                      <SortableParticipant key={p.id} id={p.id} name={p.name} />
                    ))}
                  </SortableContext>
                </Droppable>
              </div>

              <div className="list-separator"><Plus /></div>

              <div className="list-container highlight">
                <h3>Participantes del Evento</h3>
                <Droppable id="event-list-droppable" className="droppable-area">
                  <SortableContext 
                    items={eventParticipants}
                    strategy={verticalListSortingStrategy}
                  >
                    {eventParticipants.map(p => (
                      <SortableParticipant key={p.id} id={p.id} name={p.name} onRemove={(id) => {
                         const item = eventParticipants.find(x => x.id === id);
                         setEventParticipants(prev => prev.filter(x => x.id !== id));
                         setAvailableParticipants(prev => [...prev, item]);
                      }}/>
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
