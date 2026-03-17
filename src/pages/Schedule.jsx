import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Tag,
  Calendar, Edit3, Trash2, RepeatIcon, Bell, Check,
} from "lucide-react";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isToday,
} from "date-fns";

const API = "http://localhost:5000/api";

const COLORS = [
  { key: "cyan",    label: "Cyan",    value: "#00E5FF", bg: "rgba(0,229,255,0.12)" },
  { key: "violet",  label: "Violet",  value: "#7C3AED", bg: "rgba(124,58,237,0.15)" },
  { key: "emerald", label: "Emerald", value: "#10B981", bg: "rgba(16,185,129,0.12)" },
  { key: "amber",   label: "Amber",   value: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  { key: "rose",    label: "Rose",    value: "#F43F5E", bg: "rgba(244,63,94,0.12)" },
];
const CATEGORIES = ["Work", "Study", "Meeting", "Personal", "Health", "Other"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);

function EventModal({ event, selectedDate, onSave, onClose }) {
  const [form, setForm] = useState(event || {
    title: "", date: format(selectedDate, "yyyy-MM-dd"), time: "09:00",
    duration: 60, color: "cyan", category: "Work", notes: "", recurring: "none",
  });
  const colorObj = COLORS.find(c => c.key === form.color) || COLORS[0];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{event ? "Edit Event" : "New Event"}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Event Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What's this event?" autoFocus />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Start Time</label>
              <input type="time" className="input" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Duration (min)</label>
              <select className="input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))} style={{ cursor: "pointer" }}>
                {[15, 30, 45, 60, 90, 120, 180].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Recurring</label>
              <select className="input" value={form.recurring} onChange={e => setForm(p => ({ ...p, recurring: e.target.value }))} style={{ cursor: "pointer" }}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontFamily: "var(--font-display)" }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => (
                <div key={c.key} onClick={() => setForm(p => ({ ...p, color: c.key }))} style={{ width: 28, height: 28, borderRadius: 8, background: c.value, cursor: "pointer", border: form.color === c.key ? "3px solid white" : "3px solid transparent", boxShadow: form.color === c.key ? `0 0 0 2px ${c.value}` : "none", transform: form.color === c.key ? "scale(1.15)" : "scale(1)", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {form.color === c.key && <Check size={12} color="white" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontFamily: "var(--font-display)" }}>Notes</label>
            <textarea className="input" value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." rows={2} style={{ resize: "none" }} />
          </div>
        </div>

        <div className="flex gap-3 justify-end" style={{ marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!form.title.trim()} onClick={() => form.title.trim() && onSave(form)}>
            {event ? "Save changes" : "Create event"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Schedule() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(true);        // ✅ declared here
  const token = localStorage.getItem("fm_token");

  // ── FETCH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // ✅ Correct route: /api/schedule (not /api/schedules)
        const res = await fetch(`${API}/schedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const eventsForDate = (date) => events.filter(e => e.date === format(date, "yyyy-MM-dd"));

  const selectedEvents = useMemo(() =>
    events.filter(e => e.date === format(selectedDate, "yyyy-MM-dd"))
          .sort((a, b) => a.time.localeCompare(b.time))
  , [events, selectedDate]);

  // ── SAVE (create or edit) ──────────────────────────────────────────────────
  const saveEvent = async (eventData) => {
    const isEdit = !!eventData._id;
    const method = isEdit ? "PUT" : "POST";
    // ✅ Correct route
    const url = isEdit ? `${API}/schedule/${eventData._id}` : `${API}/schedule`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...eventData, tag: eventData.category }),
      });
      const saved = await res.json();
      setEvents(prev => isEdit ? prev.map(e => e._id === saved._id ? saved : e) : [...prev, saved]);
      setModal(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const deleteEvent = async (id) => {
    try {
      // ✅ Correct route
      await fetch(`${API}/schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getColor = (key) => COLORS.find(c => c.key === key) || COLORS[0];

  const timeToMinutes = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const monthDays = useMemo(() => eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }), [currentMonth]);
  const TIMELINE_START = 7 * 60;
  const TIMELINE_PIXELS_PER_MINUTE = 1.2;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "var(--text-muted)", fontSize: 14 }}>
      Loading schedule...
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp 0.4s ease" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>Schedule</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
            {format(selectedDate, "EEEE, MMMM d")} · {selectedEvents.length} events
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div style={{ display: "flex", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 3, gap: 2 }}>
            {["month", "day"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, transition: "all 0.15s", textTransform: "capitalize", background: view === v ? "var(--bg-secondary)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-muted)" }}>
                {v}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal("new")}>
            <Plus size={14} /> Add Event
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Main calendar / day view */}
        <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={16} /></button>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>{format(currentMonth, "MMMM yyyy")}</div>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={16} /></button>
          </div>

          {view === "month" && (
            <div style={{ padding: "12px 16px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 0" }}>{d}</div>
                ))}
              </div>

              {/* Calendar grid — pad start */}
              {(() => {
                const startDay = startOfMonth(currentMonth).getDay();
                const cells = [...Array(startDay).fill(null), ...monthDays];
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                    {cells.map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} />;
                      const dayEvents = eventsForDate(day);
                      const isSelected = isSameDay(day, selectedDate);
                      const today = isToday(day);
                      return (
                        <div key={day.toISOString()} onClick={() => setSelectedDate(day)} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "all 0.15s", background: isSelected ? "var(--accent-violet)" : today ? "var(--accent-cyan-dim)" : "transparent", color: isSelected ? "white" : today ? "var(--accent-cyan)" : "var(--text-primary)", fontWeight: isSelected || today ? 700 : 400, position: "relative" }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = today ? "var(--accent-cyan-dim)" : "transparent"; }}>
                          <span style={{ fontSize: 13 }}>{format(day, "d")}</span>
                          {dayEvents.length > 0 && (
                            <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
                              {dayEvents.slice(0, 3).map((ev, i) => (
                                <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: getColor(ev.color || ev.tag).value }} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {view === "day" && (
            <div style={{ position: "relative", overflowY: "auto", maxHeight: 600 }}>
              {HOURS.map(h => (
                <div key={h} style={{ display: "flex", borderBottom: "1px solid var(--border)", minHeight: 60, position: "relative" }}>
                  <div style={{ width: 56, padding: "4px 8px", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0, paddingTop: 6 }}>
                    {h === 12 ? "12pm" : h > 12 ? `${h-12}pm` : `${h}am`}
                  </div>
                  <div style={{ flex: 1, position: "relative" }}>
                    {selectedEvents
                      .filter(e => { const [eh] = e.time.split(":").map(Number); return eh === h; })
                      .map(ev => {
                        const color = getColor(ev.color || ev.tag);
                        return (
                          <div key={ev._id} onClick={() => setModal(ev)} style={{ position: "absolute", left: 4, right: 4, top: 4, background: color.bg, border: `1px solid ${color.value}40`, borderLeft: `3px solid ${color.value}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", zIndex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: color.value }}>{ev.title}</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{ev.time} · {ev.duration}min</div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel — events for selected day */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="flex items-center justify-between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>{format(selectedDate, "MMM d")}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal("new")}><Plus size={12} /> Add</button>
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                No events — click + Add to create one
              </div>
            ) : (
              <div style={{ padding: "8px 0" }}>
                {selectedEvents.map(ev => {
                  const color = getColor(ev.color || ev.tag);
                  return (
                    <div key={ev._id} className="flex items-center gap-3" style={{ padding: "10px 16px", transition: "background 0.15s", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 3, height: 40, borderRadius: 2, background: color.value, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 8, marginTop: 2 }}>
                          <span>{ev.time}</span>
                          <span>{ev.duration}min</span>
                          {ev.recurring !== "none" && <span style={{ color: color.value }}>↻ {ev.recurring}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }} onClick={e => { e.stopPropagation(); setModal(ev); }}><Edit3 size={11} /></button>
                        <button className="btn btn-ghost btn-icon" style={{ width: 26, height: 26, color: "var(--accent-rose)" }} onClick={e => { e.stopPropagation(); deleteEvent(ev._id); }}><Trash2 size={11} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <EventModal
          event={modal === "new" ? null : modal}
          selectedDate={selectedDate}
          onSave={saveEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}




