import { useEffect, useState } from "react";

import attendanceService from "../services/attendanceService";
import { flagClass } from "../utils/attendanceHelpers";

/**
 * Faculty attendance dashboard (Task 8.25).
 * Today's attendance, subject-wise summary, overall percentage.
 */
export default function AttendanceDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getFacultyDashboard()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load dashboard"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;
  if (!data) return <div className="page">No data.</div>;

  return (
    <div className="page">
      <h2>Attendance Dashboard</h2>

      <section className="detail-block">
        <h3>Today</h3>
        <p>
          {data.todayPresent}/{data.todayCount} present today
        </p>
        <h3>Overall</h3>
        <p className="big-stat">{data.overallAttendance}%</p>
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
            {data.subjectWise.map((s) => (
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
            {!data.subjectWise.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
