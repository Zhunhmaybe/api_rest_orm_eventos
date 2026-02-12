
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

export function SortableParticipant({ id, name, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="participant-item glass-panel"
    >
      <GripVertical size={16} className="text-secondary" style={{ cursor: 'grab' }} />
      <span style={{ flex: 1, fontWeight: 500 }}>{name}</span>
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onRemove(id);
          }}
          className="btn-icon"
          title="Eliminar participante"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
