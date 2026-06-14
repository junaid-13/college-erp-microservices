import { useEffect, useState } from "react";

import timetableService from "../services/timetableService";

/**
 * Today's schedule widget (Task 7.28). Student variant.
 * Shows current day's classes sorted chronologically.
 */
export default function TodaySchedule() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timetableService
      .getTodaySchedule("STUDENT")
      .then((res) => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  function renderBody() {
    if (loading) return <p>Loading…</p>;
    if (!slots.length) return <p>No classes scheduled today.</p>;
    return (
      <ul className="today-list">
        {slots.map((s) => (
          <li key={s._id}>
            <strong>
              {s.startTime}-{s.endTime}
            </strong>{" "}
            · Room {s.roomNumber || "—"} · {s.slotType}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="detail-block">
      <h3>Today&apos;s Schedule</h3>
      {renderBody()}
    </div>
  );
}
