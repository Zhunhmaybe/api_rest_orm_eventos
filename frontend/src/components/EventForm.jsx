
import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableParticipant } from './SortableParticipant';
import { Users, Plus } from 'lucide-react';

const MOCK_PARTICIPANTS = [
  { id: 'p1', name: 'Ana Garcia' },
  { id: 'p2', name: 'Carlos Rodriguez' },
  { id: 'p3', name: 'Elena Martinez' },
  { id: 'p4', name: 'David Lopez' },
  { id: 'p5', name: 'Sofia Ruiz' },
];

export default function EventForm({ onClose, onSave }) {
  // Lists state
  const [availableParticipants, setAvailableParticipants] = useState(MOCK_PARTICIPANTS);
  const [eventParticipants, setEventParticipants] = useState([]);
  
  // Drag state
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
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
    const destList = over.id === 'event-list-droppable' || eventParticipants.find(p => p.id === over.id) ? 'event' : 'available';

    // Move logic (simplified for single sortable context or transferring between lists)
    // For this UI, let's implement a simpler "Transfer on Click" or "Transfer on Drop" logic 
    // But since we want "Drag Interactiva", I'll implement transfer between two lists using dnd-kit.
    
    // Note: Implementing robust dual-list DnD requires more state management logic. 
    // To keep it simple and robust for this "Wow" factor:
    // We will treat "Available" as one SortableContext and "Event" as another
    // But dnd-kit handles this best with a single state or specialized handlers.
    
    // Let's assume simpler logic for this step: Reordering within lists is supported.
    // Transfering between lists is complex to code in one shot without mistakes. 
    // I'll stick to a "Drag from Available to Event" visual pattern using buttons for transfer 
    // OR create a SINGLE list Sortable if that's what user meant?
    // "cuando crees un evento puedas arrastrar a los participantes" -> Sounds like dragging INTO the event.
    
    // Let's implement full dual list drag and drop logic below:

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
            setAvailableParticipants(items => items.filter(p => p.id !== active.id));
            setEventParticipants(items => [...items, item]);
        } else {
            const item = eventParticipants.find(p => p.id === active.id);
            setEventParticipants(items => items.filter(p => p.id !== active.id));
            setAvailableParticipants(items => [...items, item]);
        }
    }

    setActiveId(null);
  }

  return (
    <div className="modal-backdrop">
       <div className="modal-content glass-panel animate-fade-in">
          <h2>Nuevo Evento</h2>
          
          <div className="form-group">
            <label>Título</label>
            <input type="text" className="input-field" placeholder="Ej. Conferencia 2026" />
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
                <div className="droppable-area" id="available-list-droppable">
                  <SortableContext 
                    items={availableParticipants}
                    strategy={verticalListSortingStrategy}
                  >
                    {availableParticipants.map(p => (
                      <SortableParticipant key={p.id} id={p.id} name={p.name} />
                    ))}
                  </SortableContext>
                </div>
              </div>

              <div className="list-separator"><Plus /></div>

              <div className="list-container highlight">
                <h3>Participantes del Evento</h3>
                <div className="droppable-area" id="event-list-droppable">
                  <SortableContext 
                    items={eventParticipants}
                    strategy={verticalListSortingStrategy}
                  >
                    {eventParticipants.map(p => (
                      <SortableParticipant key={p.id} id={p.id} name={p.name} onRemove={(id) => {
                         // Manual remove logic to move back to available
                         const item = eventParticipants.find(x => x.id === id);
                         setEventParticipants(prev => prev.filter(x => x.id !== id));
                         setAvailableParticipants(prev => [...prev, item]);
                      }}/>
                    ))}
                    {eventParticipants.length === 0 && (
                        <div className="empty-placeholder">Arrastra participantes aquí</div>
                    )}
                  </SortableContext>
                </div>
              </div>
              
              <DragOverlay>
                {activeId ? (
                   <div className="participant-item glass-panel dragging">
                      <GripVertical size={16} />
                      {/* Find name helper */}
                      {[...availableParticipants, ...eventParticipants].find(p => p.id === activeId)?.name}
                   </div>
                ) : null}
              </DragOverlay>

            </DndContext>
          </div>

          <div className="modal-actions">
            <button className="btn" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onSave}>Guardar Evento</button>
          </div>
       </div>
    </div>
  );
}
