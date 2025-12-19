import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================================================
    Componente individual de Tarjeta (CardItem)
    Representa UNA tarjeta del tablero
   ========================================================= */

interface CardItemProps {
  card: any;
  getDeadlineStatus: (date: string) => string;
  onEdit: (card: any) => void;
  onDelete: (cardId: number) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  getDeadlineStatus,
  onEdit,
  onDelete,
}) => {

  /* =========================================================
      DRAG & DROP (FASE 4 - Tarjeta draggable)
     ========================================================= */

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging
      ? "0 8px 20px rgba(0, 0, 0, 0.25)"
      : "none",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
      {...listeners}
    >

      {/* ESTADO DE LA TARJETA */}
      <span className="status-badge status-por-hacer">
        Por hacer
      </span>

      {/* CUERPO */}
      <div className="card-body">
        <h3>{card.title}</h3>
        {card.description && <p>{card.description}</p>}
      </div>

      {/* FECHA */}
      {card.due_date && (
        <div
          className={`card-deadline ${getDeadlineStatus(card.due_date)}`}
        >
          📅 Vence: {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}

      {/* ACCIONES */}
      <div className="card-actions">

        <button
          className="edit-card-btn"
          onPointerDown={(e) => {
            e.preventDefault();   // ⛔ evita que dnd-kit capture el gesto
            e.stopPropagation();  // ⛔ evita que burbujee al contenedor draggable
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(card);
          }}
        >
          ✏️ Editar
        </button>

        <button
          className="delete-card-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(card.id);
          }}
        >
          🗑 Eliminar
        </button>

      </div>
    </div>
  );
};

export default CardItem;
