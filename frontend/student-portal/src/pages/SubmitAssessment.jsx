import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import assessmentService from "../services/assessmentService";
import { isPastDue, submissionStatus } from "../utils/assessmentHelpers";

/** Title, description, marks/due meta and the optional assignment file link. */
function AssessmentHeader({ assessment, pastDue }) {
  return (
    <>
      <h2>{assessment.title}</h2>
      <p>{assessment.description}</p>
      <p>
        Max marks: {assessment.maxMarks} · Due:{" "}
        {new Date(assessment.dueDate).toLocaleString()}
        {pastDue ? " (past due)" : ""}
      </p>
      {assessment.attachmentUrl && (
        <p>
          <a href={assessment.attachmentUrl} target="_blank" rel="noreferrer">
            Download assignment file
          </a>
        </p>
      )}
    </>
  );
}

/** Read-only view of the student's current submission + grade. */
function SubmissionDetails({ submission, assessment, status }) {
  if (!submission) return <p>Not submitted yet.</p>;
  return (
    <>
      <p>
        Status: <span className={`flag flag-${status}`}>{status}</span> ·
        Attempt #{submission.attemptNumber}
      </p>
      {submission.submissionUrl && (
        <p>
          <a href={submission.submissionUrl} target="_blank" rel="noreferrer">
            View current file
          </a>
        </p>
      )}
      {submission.status === "GRADED" && (
        <p>
          Marks:{" "}
          <strong>
            {submission.marksObtained}/{assessment.maxMarks}
          </strong>{" "}
          — {submission.feedback || "No feedback"}
        </p>
      )}
    </>
  );
}

/** Upload form (or a disabled notice when re-submission is blocked). */
function SubmitForm({
  canSubmit,
  submitting,
  hasSubmission,
  onFile,
  onSubmit,
}) {
  if (!canSubmit) {
    return (
      <p>
        <em>Re-submission is not allowed for this assessment.</em>
      </p>
    );
  }
  let buttonLabel = "Submit";
  if (submitting) buttonLabel = "Uploading…";
  else if (hasSubmission) buttonLabel = "Re-submit";

  return (
    <form onSubmit={onSubmit} style={{ marginTop: "0.75rem" }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
        onChange={(e) => onFile(e.target.files[0])}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{ marginLeft: "0.5rem" }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}

/**
 * Student submission page (Task 13.29). Upload a file, with re-submission when
 * the assessment allows it, plus grade/feedback once graded.
 */
export default function SubmitAssessment() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [a, s] = await Promise.all([
      assessmentService.getAssessment(id),
      assessmentService.getMySubmission(id),
    ]);
    setAssessment(a.data);
    setSubmission(s.data);
  }, [id]);

  useEffect(() => {
    load().catch((err) =>
      setError(err.response?.data?.message || "Could not load assessment"),
    );
  }, [load]);

  async function submit(ev) {
    ev.preventDefault();
    setError("");
    setMessage("");
    if (!file) {
      setError("Please choose a file to submit.");
      return;
    }
    setSubmitting(true);
    try {
      await assessmentService.submitAssessment(id, file);
      setMessage("Submission uploaded successfully.");
      setFile(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !assessment)
    return <div className="page error-banner">{error}</div>;
  if (!assessment) return <div className="page">Loading…</div>;

  const status = submissionStatus(submission, assessment);
  const canSubmit = !submission || assessment.allowResubmission;
  const pastDue = isPastDue(assessment.dueDate);

  return (
    <div className="page">
      <AssessmentHeader assessment={assessment} pastDue={pastDue} />

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="detail-block">
        <h3>Your Submission</h3>
        <SubmissionDetails
          submission={submission}
          assessment={assessment}
          status={status}
        />
        <SubmitForm
          canSubmit={canSubmit}
          submitting={submitting}
          hasSubmission={Boolean(submission)}
          onFile={setFile}
          onSubmit={submit}
        />
      </section>

      <p>
        <Link to="/student/assessments">← All assessments</Link> ·{" "}
        <Link to={`/student/assessments/${id}/history`}>
          Submission history
        </Link>
      </p>
    </div>
  );
}
