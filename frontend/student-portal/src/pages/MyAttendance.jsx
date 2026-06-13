import { useEffect, useState } from "react";

import attendanceService from "../services/attendanceService";
import { flagClass } from "../utils/attendanceHelpers";

/**
 * Student attendance page (Task 8.27).
 * Overall %, subject-wise %, and recent history.
 */
export default function MyAttendance() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getSelfAttendance()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load attendance"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;
  if (!data) return <div className="page">No data.</div>;

  return (
    <div className="page">
      <h2>My Attendance</h2>

      <section className="detail-block">
        <h3>Overall</h3>
        <p className="big-stat">{data.overallAttendance}%</p>
        <p>
          {data.presentClasses}/{data.totalClasses} classes ·{" "}
          <span className={flagClass(data.flag)}>{data.flag}</span>
        </p>
      </section>

      <section className="detail-block">
        <h3>Subject-wise</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present/Total</th>
              <th>%</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {data.subjectWiseAttendance.map((s) => (
              <tr key={s.subjectId}>
                <td>{s.subjectId}</td>
                <td>
                  {s.present}/{s.total}
                </td>
                <td>{s.percentage}%</td>
                <td>
                  <span className={flagClass(s.flag)}>{s.flag}</span>
                </td>
              </tr>
            ))}
            {!data.subjectWiseAttendance.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="detail-block">
        <h3>Recent History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data.history || []).slice(0, 20).map((h) => (
              <tr key={h._id}>
                <td>
                  {h.attendanceDate ? h.attendanceDate.slice(0, 10) : "—"}
                </td>
                <td>{h.subjectId}</td>
                <td>{h.periodNumber}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
