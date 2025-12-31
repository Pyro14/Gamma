import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * CardItem Component
 * Defined locally to ensure compatibility with the Canvas preview environment
 */
interface CardItemProps {
  card: any;
  getDeadlineStatus: (date: string) => string;
  onWorklogs: (card: any) => void;
  onEdit: (card: any) => void;
  onDelete: (cardId: number) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  getDeadlineStatus,
  onWorklogs,
  onEdit,
  onDelete,
}) => {
  if (!card) return null;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.25)" : "none",
    cursor: "grab",
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column'
  };

  const stopDnd = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const totalHours = typeof card.total_hours === "number" ? card.total_hours : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
      {...listeners}
    >
      <div className="card-hours-total" style={{ color: '#1a73e8', fontWeight: 'bold', fontSize: '0.85em' }}>
        ⏱ {totalHours.toFixed(2)} h
      </div>

      <div className="card-body" style={{ margin: '8px 0' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{card.title || "Sin título"}</h3>
      </div>

      {card.due_date && (
        <div className={`card-deadline ${getDeadlineStatus ? getDeadlineStatus(card.due_date) : ""}`} style={{ fontSize: '0.8em', marginBottom: '8px' }}>
          📅 Vence: {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}

      <div className="card-actions" style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
        <button
          className="hours-card-btn"
          onPointerDown={stopDnd}
          onClick={(e) => { e.stopPropagation(); onWorklogs(card); }}
        >
          ⏱
        </button>

        <button
          className="edit-card-btn"
          onPointerDown={stopDnd}
          onClick={(e) => { e.stopPropagation(); onEdit(card); }}
        >
          Editar
        </button>

        <button
          className="delete-card-btn"
          onPointerDown={stopDnd}
          style={{ color: 'red' }}
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

/**
 * ListColumn Component
 */
interface ListColumnProps {
  title: string;
  listId: number;
  cards: any[];
  getDeadlineStatus: (date: string) => string;
  onEdit: (card: any) => void;
  onDelete: (cardId: number) => void;
  onWorklogs: (card: any) => void;
}

const ListColumn: React.FC<ListColumnProps> = ({
  title,
  listId,
  cards = [],
  getDeadlineStatus,
  onEdit,
  onDelete,
  onWorklogs,
}) => {
  const { setNodeRef } = useDroppable({
    id: String(listId),
  });

  const columnCards = (Array.isArray(cards) ? cards : [])
    .filter((card) => {
      if (!card) return false;
      const effectiveListId =
        card.list_id === undefined || card.list_id === null ? 1 : Number(card.list_id);
      return effectiveListId === listId;
    })
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  return (
    <div ref={setNodeRef} className="column" style={{ minWidth: '280px', padding: '10px' }}>
      <h2 className="column-header" style={{ marginBottom: '15px' }}>{title}</h2>

      <div className="cards-container">
        <SortableContext
          items={columnCards.map((card) => String(card.id))}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              getDeadlineStatus={getDeadlineStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onWorklogs={onWorklogs}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ListColumn;