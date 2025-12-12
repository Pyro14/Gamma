import { useState } from "react";
import { api } from "../../api";

export default function CreateCardForm({ listId, refresh }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (title.length < 1 || title.length > 80) {
            alert("El título debe tener entre 1 y 80 caracteres.");
            return;
        }

        api("/cards/", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                deadline: deadline || null,
                list_id: listId,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Error creando tarjeta");
                return res.json();
            })
            .then(() => {
                refresh();
                setTitle("");
                setDescription("");
                setDeadline("");
            })
            .catch(err => alert(err.message));
    }

    return (
        <form onSubmit={handleSubmit} className="create-card-form">
            <input
                type="text"
                placeholder="Nueva tarjeta..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <textarea
                placeholder="Descripción"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <button type="submit">Crear</button>
        </form>
    );
}
