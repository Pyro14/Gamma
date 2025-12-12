import { api } from "../../api";
import { useState } from "react";

export default function EditCardModal({ card, onClose, refresh }) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description);
    const [deadline, setDeadline] = useState(card.deadline || "");

    function save() {
        if (title.length < 1 || title.length > 80) {
            alert("El título debe tener entre 1 y 80 caracteres.");
            return;
        }

        api(`/cards/${card.id}`, {
            method: "PUT",
            body: JSON.stringify({ title, description, deadline }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar tarjeta");
                return res.json();
            })
            .then(() => {
                refresh();
                onClose();
            })
            .catch(err => alert(err.message));
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                />

                <button onClick={save}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
}
