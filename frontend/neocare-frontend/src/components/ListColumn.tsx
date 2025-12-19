// Importamos React
import React from "react";

// Importamos utilidades de dnd-kit
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Importamos el componente de tarjeta
import CardItem from "./CardItem";

/* =========================================================
    Componente de Columna del Kanban (ListColumn)
    - Es droppable
    - Contiene tarjetas sortable
    - No conoce backend ni estado global
   ========================================================= */

interface ListColumnProps {
  title: string;                  // Título visible de la columna
  listId: number;                 // ID lógico de la columna (1, 2, 3)
  cards: any[];                   // Todas las tarjetas del tablero
  getDeadlineStatus: (date: string) => string;
  onEdit: (card: any) => void;
  onDelete: (cardId: number) => void;
}

const ListColumn: React.FC<ListColumnProps> = ({
  title,
  listId,
  cards,
  getDeadlineStatus,
  onEdit,
  onDelete,
}) => {

  /* =========================================================
      DROPPABLE: la columna acepta tarjetas
     ========================================================= */

  const { setNodeRef } = useDroppable({
    id: listId, // ID de la columna (1, 2, 3)
  });

  /* =========================================================
      FILTRADO TEMPORAL (FASE 6.2)
      - Tarjetas SIN list_id → Por hacer (1)
      - Tarjetas CON list_id → su columna
     ========================================================= */

  const columnCards = cards.filter((card) => {
    const effectiveListId =
      card.list_id === undefined || card.list_id === null
        ? 1
        : Number(card.list_id);

    return effectiveListId === listId;
  });

  return (
    <div ref={setNodeRef} className="column">

      {/* TÍTULO DE LA COLUMNA */}
      <h2>{title}</h2>

      {/* CONTENEDOR DE TARJETAS */}
      <div className="cards">
        <SortableContext
          items={columnCards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              getDeadlineStatus={getDeadlineStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ListColumn;
