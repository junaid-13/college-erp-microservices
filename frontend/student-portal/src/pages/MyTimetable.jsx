import { useEffect, useState } from "react";

import TodaySchedule from "../components/TodaySchedule";
import timetableService from "../services/timetableService";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

function buildGrid(slots) {
  const grid = {};
  DAYS.forEach((d) => {
    grid[d] = {};
  });
  slots.forEach((s) => {
    if (!grid[s.day]) grid[s.day] = {};
    grid[s.day][s.periodNumber] = s;
  });
  return grid;
}

/**
 * Student weekly timetable (Task 7.27). Read-only.
 */
export default function MyTimetable() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timetableService
      .getStudentTimetable()
      .then((res) => setSlots(res.data?.slots || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load timetable"),
      )
      .finally(() => setLoading(false));
  }, []);

  const grid = buildGrid(slots);

  return (
    <div className="page">
      <h2>My Timetable</h2>
      <TodaySchedule />

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="timetable-grid">
          <thead>
            <tr>
              <th>Day \ Period</th>
              {PERIODS.map((p) => (
                <th key={p}>P{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <th>{day.slice(0, 3)}</th>
                {PERIODS.map((p) => {
                  const slot = grid[day]?.[p];
                  return (
                    <td key={p} className={slot ? "filled" : "empty"}>
                      {slot ? (
                        <div className="cell">
                          <span className="cell-room">
                            {slot.roomNumber || "—"}
                          </span>
                          <span className="cell-time">
                            {slot.startTime}-{slot.endTime}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
