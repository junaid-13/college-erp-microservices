import { useState } from "react";

import MarksTable from "../components/MarksTable";
import marksService from "../services/marksService";
import subjectService from "../services/subjectService";

/**
 * Faculty marks entry page (Task 9.25).
 *
 * Flow: load my subjects + exams, pick subject + exam, enter the class roster,
 * then bulk-save marks.
 */

function MarksFilters({
  subjects,
  exams,
  subjectId,
  examId,
  maxMarks,
  setSubjectId,
  onExamChange,
  setMaxMarks,
}) {
  if (!subjects.length) return null;

  return (
    <div className="student-filters" style={{ marginTop: "0.75rem" }}>
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
        <option value="">-- subject --</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectCode} — {s.subjectName}
          </option>
        ))}
      </select>

      <select value={examId} onChange={(e) => onExamChange(e.target.value)}>
        <option value="">-- exam --</option>
        {exams.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name} ({e.maxMarks})
          </option>
        ))}
      </select>

      <input
        type="number"
        value={maxMarks}
        onChange={(e) => setMaxMarks(e.target.value)}
        style={{ width: "90px" }}
      />
    </div>
  );
}

function RosterBuilder({ roster, setRoster, buildRoster, subjectId, examId }) {
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

      <button onClick={buildRoster} disabled={!subjectId || !examId}>
        Build Roster
      </button>
    </>
  );
}

function handleSave(subjectId, examId, maxMarks, entries) {
  return marksService.bulkUploadMarks({
    subjectId,
    examId,
    maxMarks: Number(maxMarks),
    entries,
  });
}

export default function MarksEntry() {
  const [subjects, setSubjects] = useState([]),
    [exams, setExams] = useState([]),
    [subjectId, setSubjectId] = useState(""),
    [examId, setExamId] = useState(""),
    [maxMarks, setMaxMarks] = useState(50),
    [roster, setRoster] = useState(""),
    [students, setStudents] = useState([]),
    [error, setError] = useState("");

  async function loadRefs() {
    setError("");

    try {
      const [subs, exs] = await Promise.all([
        subjectService.getFacultySubjects(),
        marksService.getExams(),
      ]);

      setSubjects(subs.data || []);
      setExams(exs.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subjects/exams");
    }
  }

  function onExamChange(id) {
    setExamId(id);

    const exam = exams.find((e) => e._id === id);
    if (exam) setMaxMarks(exam.maxMarks);
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
      <h2>Marks Entry</h2>

      {error && <div className="error-banner">{error}</div>}

      <section className="detail-block">
        <button className="btn" onClick={loadRefs}>
          Load Subjects & Exams
        </button>

        <MarksFilters
          subjects={subjects}
          exams={exams}
          subjectId={subjectId}
          examId={examId}
          maxMarks={maxMarks}
          setSubjectId={setSubjectId}
          onExamChange={onExamChange}
          setMaxMarks={setMaxMarks}
        />

        <RosterBuilder
          roster={roster}
          setRoster={setRoster}
          buildRoster={buildRoster}
          subjectId={subjectId}
          examId={examId}
        />
      </section>

      {students.length > 0 && subjectId && examId && (
        <section className="detail-block">
          <h3>Roster ({students.length})</h3>

          <MarksTable
            students={students}
            maxMarks={Number(maxMarks)}
            onSave={(entries) =>
              handleSave(subjectId, examId, maxMarks, entries)
            }
          />
        </section>
      )}
    </div>
  );
}