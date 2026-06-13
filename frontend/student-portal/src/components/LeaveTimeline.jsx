/**
 * Leave status timeline (Task 10.26).
 *
 * Canonical shared component. Because each portal is an independent Vite app
 * that only bundles files under its own src/, this file is the source of truth
 * and is mirrored into each portal's components/ directory.
 *
 * Renders the leave's audit trail (Applied / Approved / Rejected / Cancelled)
 * with timestamps.
 *
 * @param {Array<{action,performedAt,remarks}>} timeline
 */
export default function LeaveTimeline({ timeline = [] }) {
  if (!timeline.length) return <p>No history.</p>;

  return (
    <ul className="leave-timeline">
      {timeline.map((t, i) => (
        <li key={i} className={`tl tl-${t.action}`}>
          <span className="tl-dot" />
          <div className="tl-body">
            <strong>{t.action}</strong>
            <span className="tl-time">
              {t.performedAt ? new Date(t.performedAt).toLocaleString() : ""}
            </span>
            {t.remarks ? <em className="tl-remarks">{t.remarks}</em> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
