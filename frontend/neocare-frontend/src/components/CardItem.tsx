import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  // Protección de seguridad
  if (!card) return null;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.25)" : "none",
    cursor: "grab",
  };

  // Detener la propagación para que los clics en botones no activen el arrastre
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
      {/* Badge de horas: Solo número y símbolo */}
      <div className="card-hours-total">
        ⏱ {totalHours.toFixed(2)} h
      </div>

      <div className="card-body">
        <h3>{card.title || "Sin título"}</h3>
        {/* Descripción eliminada para hacer la tarjeta más compacta */}
      </div>

      {card.due_date && (
        <div className={`card-deadline ${getDeadlineStatus ? getDeadlineStatus(card.due_date) : ""}`}>
          📅 Vence: {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}

      <div className="card-actions">
        <button
          className="hours-card-btn"
          onPointerDown={stopDnd}
          onClick={(e) => {
            e.stopPropagation();
            onWorklogs(card);
          }}
        >
          ⏱ Horas
        </button>

        <button
          className="edit-card-btn"
          onPointerDown={stopDnd}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
        >
          ✏️ Editar
        </button>

        <button
          className="delete-card-btn"
          onPointerDown={stopDnd}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
        >
          🗑 Borrar
        </button>
      </div>
    </div>
  );
};

export default CardItem;
