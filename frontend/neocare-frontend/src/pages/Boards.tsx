// Importamos React para poder usar JSX y hooks
import React, { useEffect, useState } from "react";

// Importamos dos componentes principales de la interfaz
import ListColumn from "../components/ListColumn";
import Header from "../components/Header";     // Barra superior
import Sidebar from "../components/Sidebar";   // Menú lateral
import CrearVentanaEmergente from "../components/CrearVentanaEmergente";
import CardItem from "../components/CardItem";
import { DndContext, DragOverlay } from "@dnd-kit/core"; // Contexto para drag-and-drop
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { closestCenter } from "@dnd-kit/core";

// Importación de estilos específicos para la vista de tableros
import "./Boards.css";

// lista de estados de vencimiento
const LIST_IDS = {
  POR_HACER: 1,
  EN_CURSO: 2,
  HECHO: 3,
};

// ============================================================
// Componente principal de la vista de Tablero (Boards)
// ============================================================
const Boards: React.FC = () => {

  /* =========================================================
      ESTADOS PRINCIPALES
     ========================================================= */

  // Usuario autenticado
  const [user, setUser] = useState<any>(null);

  // Mensajes de error
  const [error, setError] = useState("");

  // Control de carga inicial
  const [loading, setLoading] = useState(true);

  // Mostrar / ocultar la ventana emergente de crear o editar tarjeta
  const [mostrarCrearTarjeta, setMostrarCrearTarjeta] = useState(false);

  // Tarjetas del tablero actual
  const [cards, setCards] = useState<any[]>([]);

  // ID del tablero activo del usuario
  const [boardId, setBoardId] = useState<number | null>(null);

  // Tarjeta que se está editando (null = estamos creando una nueva)
  const [cardEditando, setCardEditando] = useState<any | null>(null);

  // 🔥 Tarjeta activa durante drag (para DragOverlay)
  const [activeCard, setActiveCard] = useState<any | null>(null);

  /* =========================================================
      UTILIDAD: calcular estado de vencimiento
     ========================================================= */
  function getDeadlineStatus(dueDate: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fecha = new Date(dueDate);
    fecha.setHours(0, 0, 0, 0);

    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";   // 🔴 vencido
    if (diffDays <= 2) return "soon";     // 🟠 próximo
    return "normal";                      // 🟢 normal
  }

  /* =========================================================
      useEffect → Cargar usuario autenticado y su tablero
     ========================================================= */
  useEffect(() => {
    const fetchUserAndBoard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No hay token. Inicia sesión primero.");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) {
          setError("No se pudo obtener la información del usuario");
          setLoading(false);
          return;
        }

        const userData = await userResponse.json();
        setUser(userData);

        const boardsResponse = await fetch("http://127.0.0.1:8000/boards/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!boardsResponse.ok) {
          setError("No se pudieron obtener los tableros");
          setLoading(false);
          return;
        }

        const boardsData = await boardsResponse.json();

        if (boardsData.length > 0) {
          setBoardId(boardsData[0].id);
        } else {
          setError("El usuario no tiene tableros");
        }

      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      }

      setLoading(false);
    };

    fetchUserAndBoard();
  }, []);

  /* =========================================================
      useEffect → Cargar tarjetas del tablero activo
     ========================================================= */
  useEffect(() => {
    if (!boardId) return;

    const fetchCards = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/cards/?board_id=${boardId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error al cargar tarjetas");
          return;
        }

        const data = await response.json();

        const normalized = data.map((card: any) => ({
          ...card,
          list_id: card.list_id ?? LIST_IDS.POR_HACER,
        }));

        setCards(normalized);

      } catch (error) {
        console.error("No se pudo conectar con el servidor");
      }
    };

    fetchCards();
  }, [boardId]);

  /* =========================================================
      DRAG & DROP (FASE 3 + SUAVIZADO)
     ========================================================= */

  const handleDragStart = (event: any) => {
    const { active } = event;
    const found = cards.find((c) => c.id === active.id);
    if (found) {
      setActiveCard(found);
    }
  };

  const handleDragOver = () => {};

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeCardId = active.id;

    // Caso 1: se suelta sobre una COLUMNA
    if (Object.values(LIST_IDS).includes(over.id)) {
      const targetListId = over.id;

      setCards((prev) =>
        prev.map((card) =>
          card.id === activeCardId
            ? { ...card, list_id: targetListId }
            : card
        )
      );

      setActiveCard(null);
      return;
    }

    // Caso 2: reordenación dentro de columna
    if (active.id !== over.id) {
      setCards((prevCards) => {
        const oldIndex = prevCards.findIndex((c) => c.id === active.id);
        const newIndex = prevCards.findIndex((c) => c.id === over.id);
        return arrayMove(prevCards, oldIndex, newIndex);
      });
    }

    setActiveCard(null);
  };

  /* =========================================================
      MENSAJES DE CARGA Y ERROR
     ========================================================= */
  if (loading) return <p style={{ padding: "20px" }}>Cargando tablero...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  console.log("CARDS EN BOARDS:", cards);

  /* =========================================================
      RENDER PRINCIPAL
     ========================================================= */
  return (
    <div className="board-container">
      <Header user={user} />

      <div className="content">
        <Sidebar
          user={user}
          onCrearTarjeta={() => {
            setCardEditando(null);
            setMostrarCrearTarjeta(true);
          }}
        />

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban">

            <ListColumn
              title="Por Hacer"
              listId={LIST_IDS.POR_HACER}
              cards={cards}
              getDeadlineStatus={getDeadlineStatus}
              onEdit={(c) => {
                setCardEditando(c);
                setMostrarCrearTarjeta(true);
              }}
              onDelete={async (cardId) => {
                if (!window.confirm("¿Seguro que quieres eliminar esta tarjeta?")) return;

                const token = localStorage.getItem("token");

                const response = await fetch(
                  `http://127.0.0.1:8000/cards/${cardId}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (!response.ok) {
                  alert("Error al eliminar la tarjeta");
                  return;
                }

                setCards((prev) => prev.filter((c) => c.id !== cardId));
              }}
            />

            <ListColumn
              title="En Curso"
              listId={LIST_IDS.EN_CURSO}
              cards={cards}
              getDeadlineStatus={getDeadlineStatus}
              onEdit={(c) => {
                setCardEditando(c);
                setMostrarCrearTarjeta(true);
              }}
              onDelete={async (cardId) => {
                if (!window.confirm("¿Seguro que quieres eliminar esta tarjeta?")) return;

                const token = localStorage.getItem("token");

                const response = await fetch(
                  `http://127.0.0.1:8000/cards/${cardId}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (!response.ok) {
                  alert("Error al eliminar la tarjeta");
                  return;
                }

                setCards((prev) => prev.filter((c) => c.id !== cardId));
              }}
            />

            <ListColumn
              title="Hecho"
              listId={LIST_IDS.HECHO}
              cards={cards}
              getDeadlineStatus={getDeadlineStatus}
              onEdit={(c) => {
                setCardEditando(c);
                setMostrarCrearTarjeta(true);
              }}
              onDelete={async (cardId) => {
                if (!window.confirm("¿Seguro que quieres eliminar esta tarjeta?")) return;

                const token = localStorage.getItem("token");

                const response = await fetch(
                  `http://127.0.0.1:8000/cards/${cardId}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (!response.ok) {
                  alert("Error al eliminar la tarjeta");
                  return;
                }

                setCards((prev) => prev.filter((c) => c.id !== cardId));
              }}
            />

          </div>

          {/* ===================== DRAG OVERLAY ===================== */}
          <DragOverlay>
            {activeCard ? (
              <CardItem
                card={activeCard}
                getDeadlineStatus={getDeadlineStatus}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>

        </DndContext>
      </div>

      {/* =========================================================
          MODAL CREAR / EDITAR
         ========================================================= */}

      <CrearVentanaEmergente
        isOpen={mostrarCrearTarjeta}
        cardInicial={cardEditando}
        onClose={() => {
          setMostrarCrearTarjeta(false);
          setCardEditando(null);
        }}
        onSubmit={async (data) => {
          if (!boardId) return;

          const token = localStorage.getItem("token");

          if (cardEditando) {
            const response = await fetch(
              `http://127.0.0.1:8000/cards/${cardEditando.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
              }
            );

            if (!response.ok) {
              alert("Error al editar la tarjeta");
              return;
            }

            const updatedCard = await response.json();

            setCards((prev) =>
              prev.map((c) =>
                c.id === updatedCard.id
                  ? { ...c, ...updatedCard, list_id: c.list_id }
                  : c
              )
            );
          } else {
            const response = await fetch("http://127.0.0.1:8000/cards/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...data,
                board_id: boardId,
              }),
            });

            if (!response.ok) {
              alert("Error al crear la tarjeta");
              return;
            }

            const newCard = await response.json();

            setCards((prev) => [
              ...prev,
              { ...newCard, list_id: LIST_IDS.POR_HACER },
            ]);
          }

          setMostrarCrearTarjeta(false);
          setCardEditando(null);
        }}
      />
    </div>
  );
};

export default Boards;
