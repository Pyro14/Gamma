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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.25)" : "none",
    cursor: "grab",
  };

  console.log("Horas tarjeta:", card.id, card.total_hours);

  const stopDnd = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  // ==============================
  // Total de horas de la tarjeta
  // (viene calculado desde backend)
  // ==============================
  const totalHours =
    typeof card.total_hours === "number" ? card.total_hours : 0;

  <div className="card-hours-total">
    {totalHours.toFixed(2)} h 
  </div>  
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
      {...listeners}
    >
      {/* ==============================
          TOTAL DE HORAS (badge superior)
         ============================== */}
      <div className="card-hours-total">
        {totalHours.toFixed(2)} h
      </div>

      <div className="card-body">
        <h3>{card.title}</h3>
        {card.description && <p>{card.description}</p>}
      </div>

      {card.due_date && (
        <div className={`card-deadline ${getDeadlineStatus(card.due_date)}`}>
          📅 Vence: {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}

      <div className="card-actions">
        <button
          className="hours-card-btn"
          onPointerDown={stopDnd}
          onMouseDown={stopDnd}
          onTouchStart={stopDnd}
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
          onMouseDown={stopDnd}
          onTouchStart={stopDnd}
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
          onMouseDown={stopDnd}
          onTouchStart={stopDnd}
          onClick={(e) => {
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

