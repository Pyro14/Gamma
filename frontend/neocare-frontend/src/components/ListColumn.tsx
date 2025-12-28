import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import CardItem from "./CardItem";

interface ListColumnProps {
  title: string;
  listId: number;
  cards: any[];
  getDeadlineStatus: (date: string) => string;
  onEdit: (card: any) => void;
  onDelete: (cardId: number) => void;

  // ✅ NUEVO
  onWorklogs: (card: any) => void;
}

const ListColumn: React.FC<ListColumnProps> = ({
  title,
  listId,
  cards,
  getDeadlineStatus,
  onEdit,
  onDelete,
  onWorklogs,
}) => {
  const { setNodeRef } = useDroppable({
    id: listId,
  });

  const columnCards = cards.filter((card) => {
    const effectiveListId =
      card.list_id === undefined || card.list_id === null ? 1 : Number(card.list_id);

    return effectiveListId === listId;
  });

  return (
    <div ref={setNodeRef} className="column">
      <h2>{title}</h2>

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
              onWorklogs={onWorklogs}   // ✅ AQUÍ ESTABA EL FALLO
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ListColumn;
