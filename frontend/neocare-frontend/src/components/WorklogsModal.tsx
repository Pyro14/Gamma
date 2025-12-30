import React, { useEffect, useMemo, useState } from "react";
import "./WorklogsModal.css";

type AnyObj = Record<string, any>;

interface WorklogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: AnyObj | null;
  currentUser?: AnyObj | null;
  apiBaseUrl?: string; // ej: "http://127.0.0.1:8000"
}

const WorklogsModal: React.FC<WorklogsModalProps> = ({
  isOpen,
  onClose,
  card,
  currentUser,
  apiBaseUrl = "http://127.0.0.1:8000",
}) => {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [worklogs, setWorklogs] = useState<AnyObj[]>([]);

  // ================================
  // TOTAL DE HORAS (calculado)
  // ================================
  const totalHours = useMemo(() => {
    return worklogs.reduce((acc, wl) => acc + Number(wl.hours || 0), 0);
  }, [worklogs]);

  // Form crear
  const [hours, setHours] = useState<string>("");
  const [workDate, setWorkDate] = useState<string>(() => {
    // YYYY-MM-DD
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [note, setNote] = useState<string>("");

  // Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editHours, setEditHours] = useState<string>("");
  const [editWorkDate, setEditWorkDate] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");

  const headersJson = useMemo(() => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, [token]);

  const headersAuthOnly = useMemo(() => {
    const h: Record<string, string> = {};
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, [token]);

  // ====== RUTAS CORRECTAS (Swagger) ======
  // Listar: GET /cards/{card_id}/worklogs
  // Crear:  POST /cards/{card_id}/worklogs
  // Update: PATCH /worklogs/{worklog_id}
  // Delete: DELETE /worklogs/{worklog_id}

  const listUrl = useMemo(() => {
    if (!card?.id) return "";
    return `${apiBaseUrl}/cards/${card.id}/worklogs`;
  }, [apiBaseUrl, card?.id]);

  const createUrl = listUrl;

  const loadWorklogs = async () => {
    if (!listUrl) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(listUrl, { headers: headersAuthOnly });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error listando worklogs (${res.status}). ${txt}`);
      }
      const data = await res.json();
      setWorklogs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setWorklogs([]);
      setError(e?.message || "Error cargando worklogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (!card?.id) return;
    loadWorklogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, card?.id, listUrl]);

  const resetCreateForm = () => {
    setHours("");
    setNote("");
    // mantenemos workDate como hoy
  };

  const onCreate = async () => {
    if (!card?.id) return;
    if (!hours || Number(hours) <= 0) {
      setError("Horas inválidas. Debe ser > 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        hours: Number(hours),
        date: workDate,
        note: note || null,
      };

      const res = await fetch(createUrl, {
        method: "POST",
        headers: headersJson,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error creando worklog (${res.status}). ${txt}`);
      }

      resetCreateForm();
      await loadWorklogs();
    } catch (e: any) {
      setError(e?.message || "Error creando worklog");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (wl: AnyObj) => {
    setEditingId(Number(wl.id));
    setEditHours(String(wl.hours ?? ""));
    setEditWorkDate(String(wl.date ?? ""));
    setEditNote(String(wl.note ?? ""));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditHours("");
    setEditWorkDate("");
    setEditNote("");
  };

  const saveEdit = async (worklogId: number) => {
    if (!editHours || Number(editHours) <= 0) {
      setError("Horas inválidas en edición. Debe ser > 0.");
      return;
    }
    if (!editWorkDate) {
      setError("Fecha inválida en edición.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        hours: Number(editHours),
        date: editWorkDate,
        note: editNote || null,
      };

      const res = await fetch(`${apiBaseUrl}/worklogs/${worklogId}`, {
        method: "PATCH",
        headers: headersJson,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error actualizando worklog (${res.status}). ${txt}`);
      }

      cancelEdit();
      await loadWorklogs();
    } catch (e: any) {
      setError(e?.message || "Error actualizando worklog");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorklog = async (worklogId: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro de horas?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiBaseUrl}/worklogs/${worklogId}`, {
        method: "DELETE",
        headers: headersAuthOnly,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Error eliminando worklog (${res.status}). ${txt}`);
      }

      await loadWorklogs();
    } catch (e: any) {
      setError(e?.message || "Error eliminando worklog");
    } finally {
      setLoading(false);
    }
  };

  const isMine = (wl: AnyObj) => {
    // si backend devuelve user_id y currentUser.id
    if (!currentUser?.id) return true; // si no sabemos, no bloqueamos
    return wl.user_id === currentUser.id;
  };

  if (!isOpen) return null;

  return (
    <div className="wl-overlay" onClick={onClose}>
      <div className="wl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wl-header">
          <h2>⏱ Horas</h2>
          <button className="wl-close" onClick={onClose} aria-label="Cerrar">
            ✖
          </button>
        </div>

        <div className="wl-subtitle">
          <strong>Tarjeta:</strong> {card?.title ?? "(sin título)"}{" "}
          {card?.id ? <span style={{ opacity: 0.7 }}> (ID: {card.id})</span> : null}
        </div>

        {error ? <div className="wl-error">{error}</div> : null}

        {/* Crear */}
        <div className="wl-create">
          <div className="wl-row">
            <label>Horas</label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Ej: 1.5"
              disabled={loading}
            />
          </div>

          <div className="wl-row">
            <label>Fecha</label>
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="wl-row">
            <label>Nota</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Opcional"
              disabled={loading}
            />
          </div>

          <div className="wl-actions">
            <button onClick={onCreate} disabled={loading || !card?.id}>
              Añadir
            </button>
            <button onClick={loadWorklogs} disabled={loading || !card?.id}>
              Recargar
            </button>
          </div>
        </div>

        {/* ================================
            TOTAL DE HORAS
        ================================ */}
        <div
          style={{
            margin: "10px 0",
            padding: "8px 12px",
            borderRadius: "6px",
            background: "#f5f5f5",
            fontWeight: 600,
            textAlign: "right",
          }}
        >
          ⏱ Total horas de la tarjeta:{" "}
          <span style={{ color: "#2e7d32" }}>{totalHours.toFixed(2)} h</span>
        </div>

        {/* Lista */}
        <div className="wl-list">
          {loading ? <p>Cargando...</p> : null}
          {!loading && worklogs.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No hay horas registradas para esta tarjeta.</p>
          ) : null}

          {worklogs.map((wl) => {
            const id = Number(wl.id);
            const mine = isMine(wl);

            const wlHours = wl.hours ?? "";
            const wlDate = wl.date ?? "";
            const wlNote = wl.note ?? "";

            const editing = editingId === id;

            return (
              <div key={id} className="wl-item">
                <div className="wl-main">
                  {editing ? (
                    <>
                      <div className="wl-edit-grid">
                        <input
                          type="number"
                          min="0"
                          step="0.25"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          disabled={loading}
                        />
                        <input
                          type="date"
                          value={editWorkDate}
                          onChange={(e) => setEditWorkDate(e.target.value)}
                          disabled={loading}
                        />
                        <input
                          type="text"
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Nota"
                          disabled={loading}
                        />
                      </div>

                      <div className="wl-actions">
                        <button onClick={() => saveEdit(id)} disabled={loading}>
                          Guardar
                        </button>
                        <button onClick={cancelEdit} disabled={loading}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="wl-line">
                        <strong>{wlHours}</strong> h{" "}
                        <span style={{ opacity: 0.8 }}>· {wlDate}</span>
                      </div>
                      {wlNote ? <div className="wl-note">{wlNote}</div> : null}

                      <div className="wl-actions">
                        <button
                          onClick={() => startEdit(wl)}
                          disabled={!mine || loading}
                          title={mine ? "" : "Solo puedes editar tus horas"}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteWorklog(id)}
                          disabled={!mine || loading}
                          title={mine ? "" : "Solo puedes borrar tus horas"}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="wl-footer">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default WorklogsModal;
