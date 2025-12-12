import { useEffect, useState } from "react";
import { api } from "../../api";
import CardItem from "./CardItem";
import CreateCardForm from "./CreateCardForm";

export default function BoardPage({ boardId }) {
    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        loadLists();
        loadCards();
    }, [boardId]);

    function loadLists() {
        api(`/lists?board_id=${boardId}`)
            .then(res => res.json())
            .then(data => setLists(data));
    }

    function loadCards() {
        api(`/cards?board_id=${boardId}`)
            .then(res => res.json())
            .then(data => setCards(data));
    }

    return (
        <div className="board-container">
            {lists.map(list => (
                <div key={list.id} className="list-column">
                    <h3>{list.name}</h3>

                    {/* Filtrar tarjetas por columna */}
                    {cards
                        .filter(c => c.list_id === list.id)
                        .map(card => (
                            <CardItem
                                key={card.id}
                                card={card}
                                refresh={loadCards}
                            />
                        ))}

                    <CreateCardForm listId={list.id} refresh={loadCards} />
                </div>
            ))}
        </div>
    );
}
