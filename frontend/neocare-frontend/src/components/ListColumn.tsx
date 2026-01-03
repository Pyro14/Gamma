import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Componente CardItem
 * Representa de forma individual cada tarjeta (tarea) del tablero.
 * Incluye la lógica de arrastre (dnd-kit) y acciones de edición/borrado.
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

  // Hook para habilitar el comportamiento de ordenación/arrastre en la tarjeta
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  // Estilos dinámicos para manejar la transformación visual durante el arrastre
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1, // Feedback visual al arrastrar
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

  // Evita que el evento de arrastre se dispare al hacer clic en los botones de acción
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
      {/* Visualización de las horas totales registradas en la tarjeta */}
      <div className="card-hours-total" style={{ color: '#1a73e8', fontWeight: 'bold', fontSize: '0.85em' }}>
        ⏱ {totalHours.toFixed(2)} h
      </div>

      <div className="card-body" style={{ margin: '8px 0' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{card.title || "Sin título"}</h3>
      </div>

      {/* Fecha de vencimiento con estado visual dinámico (colores según cercanía) */}
      {card.due_date && (
        <div className={`card-deadline ${getDeadlineStatus ? getDeadlineStatus(card.due_date) : ""}`} style={{ fontSize: '0.8em', marginBottom: '8px' }}>
          📅 Vence: {new Date(card.due_date).toLocaleDateString()}
        </div>
      )}

      {/* Botones de acción: Registro de horas, Edición y Eliminación */}
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
 * Componente ListColumn
 * Representa una columna del tablero Kanban (ej: To Do, In Progress, Done).
 * Se encarga de filtrar las tarjetas que le pertenecen y ordenarlas.
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
  // Define esta columna como una zona donde se pueden soltar elementos (droppable)
  const { setNodeRef } = useDroppable({
    id: String(listId),
  });

  /**
   * Lógica de Filtrado y Ordenación:
   * 1. Filtramos las tarjetas para mostrar solo las que coincidan con 'listId'.
   * 2. Ordenamos de forma descendente basándonos en 'total_hours'.
   */
  const columnCards = (Array.isArray(cards) ? cards : [])
    .filter((card) => {
      if (!card) return false;
      // Normalizamos el ID de lista (por defecto 1 si es nulo)
      const effectiveListId =
        card.list_id === undefined || card.list_id === null ? 1 : Number(card.list_id);
      return effectiveListId === listId;
    })
    .sort((a, b) => {
      // Ordenación: De más horas registradas a menos (Descendente)
      const hoursA = typeof a.total_hours === "number" ? a.total_hours : 0;
      const hoursB = typeof b.total_hours === "number" ? b.total_hours : 0;
      return hoursB - hoursA;
    });

  return (
    <div ref={setNodeRef} className="column" style={{ minWidth: '280px', padding: '10px' }}>
      <h2 className="column-header" style={{ marginBottom: '15px' }}>{title}</h2>

      <div className="cards-container">
        {/* Contexto necesario para que dnd-kit sepa qué IDs están presentes en esta columna */}
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