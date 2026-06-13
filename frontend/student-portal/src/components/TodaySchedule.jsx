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

  return (
    <div className="detail-block">
      <h3>Today&apos;s Schedule</h3>
      {loading ? (
        <p>Loading…</p>
      ) : slots.length ? (
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
      ) : (
        <p>No classes scheduled today.</p>
      )}
    </div>
  );
}
