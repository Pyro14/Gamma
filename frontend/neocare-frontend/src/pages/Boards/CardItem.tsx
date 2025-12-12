import "./card.css";

export default function CardItem({ card, refresh }) {
    const deadline = card.deadline ? new Date(card.deadline) : null;
    const soon =
        deadline && (deadline.getTime() - Date.now()) < 86400000; // < 24h

    return (
        <div className="card-item">
            <h4>{card.title}</h4>

            {deadline && (
                <span className={soon ? "badge urgent" : "badge"}>
                    {deadline.toLocaleDateString()}
                </span>
            )}
        </div>
    );
}
