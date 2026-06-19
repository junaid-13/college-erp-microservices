import { useState } from "react";

import AttendanceTable from "../components/AttendanceTable";
import attendanceService from "../services/attendanceService";
import subjectService from "../services/subjectService";

/**
 * Faculty attendance marking page (Task 8.23).
 *
 * Flow: pick a subject (from the faculty's assigned subjects), enter the class
 * roster (student ids), set the date/period, then bulk-save.
 */

function SubjectSelector({ subjects, subjectId, setSubjectId }) {
  if (!subjects.length) return null;

  return (
    <label style={{ display: "block", marginTop: "0.75rem" }}>
      Subject
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
        <option value="">-- select --</option>

        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectCode} — {s.subjectName}
          </option>
        ))}
      </select>
    </label>
  );
}

function AttendanceMeta({ meta, setMeta }) {
  return (
    <div className="student-filters" style={{ marginTop: "0.75rem" }}>
      <input
        type="date"
        value={meta.attendanceDate}
        onChange={(e) =>
          setMeta((m) => ({ ...m, attendanceDate: e.target.value }))
        }
      />

      <input
        type="number"
        placeholder="Period"
        value={meta.periodNumber}
        onChange={(e) =>
          setMeta((m) => ({ ...m, periodNumber: e.target.value }))
        }
        style={{ width: "90px" }}
      />

      <input
        placeholder="Section"
        value={meta.section}
        onChange={(e) => setMeta((m) => ({ ...m, section: e.target.value }))}
        style={{ width: "80px" }}
      />
    </div>
  );
}

function RosterBuilder({ roster, setRoster, buildRoster, subjectId }) {
  return (
    <>
      <label style={{ display: "block", marginTop: "0.75rem" }}>
        Class Roster (student ids, comma/space separated)
        <textarea
          rows="3"
          value={roster}
          onChange={(e) => setRoster(e.target.value)}
        />
      </label>

      <button onClick={buildRoster} disabled={!subjectId}>
        Build Roster
      </button>
    </>
  );
}

function handleSave(subjectId, meta, entries) {
  return attendanceService.bulkMarkAttendance({
    subjectId,
    attendanceDate: meta.attendanceDate,
    periodNumber: Number(meta.periodNumber),
    section: meta.section,
    entries,
  });
}

export default function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [meta, setMeta] = useState({
    attendanceDate: new Date().toISOString().slice(0, 10),
    periodNumber: 1,
    section: "A",
  });
  const [roster, setRoster] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  async function loadSubjects() {
    try {
      const res = await subjectService.getFacultySubjects();
      setSubjects(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subjects");
    }
  }

  function buildRoster() {
    const ids = roster
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    setStudents(ids.map((id) => ({ _id: id, label: id })));
  }

  return (
    <div className="page">
      <h2>Mark Attendance</h2>

      {error && <div className="error-banner">{error}</div>}

      <section className="detail-block">
        <button className="btn" onClick={loadSubjects}>
          Load My Subjects
        </button>

        <SubjectSelector
          subjects={subjects}
          subjectId={subjectId}
          setSubjectId={setSubjectId}
        />

        <AttendanceMeta meta={meta} setMeta={setMeta} />

        <RosterBuilder
          roster={roster}
          setRoster={setRoster}
          buildRoster={buildRoster}
          subjectId={subjectId}
        />
      </section>

      {students.length > 0 && subjectId && (
        <section className="detail-block">
          <h3>Roster ({students.length})</h3>

          <AttendanceTable
            students={students}
            onSave={(entries) => handleSave(subjectId, meta, entries)}
          />
        </section>
      )}
    </div>
  );
}
