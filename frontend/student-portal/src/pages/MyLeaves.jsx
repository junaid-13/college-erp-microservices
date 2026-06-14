import { useEffect, useState, useCallback, Fragment } from "react";

import LeaveTimeline from "../components/LeaveTimeline";
import leaveService from "../services/leaveService";
import { statusClass } from "../utils/leaveHelpers";

/**
 * My leaves history (Task 10.23). Shared between student & faculty portals.
 * Supports cancelling pending requests and viewing the status timeline.
 */
function LeaveRow({ leave: l, isOpen, timeline, onToggle, onCancel }) {
  return (
    <Fragment>
      <tr>
        <td>{l.leaveType}</td>
        <td>{l.fromDate?.slice(0, 10)}</td>
        <td>{l.toDate?.slice(0, 10)}</td>
        <td>{l.numberOfDays}</td>
        <td>
          <span className={statusClass(l.status)}>{l.status}</span>
        </td>
        <td>{l.remarks || "—"}</td>
        <td className="actions">
          <button onClick={() => onToggle(l._id)}>History</button>
          {l.status === "PENDING" && (
            <button onClick={() => onCancel(l._id)}>Cancel</button>
          )}
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="7">
            <LeaveTimeline timeline={timeline} />
          </td>
        </tr>
      )}
    </Fragment>
  );
}

function LeavesTable({ leaves, openId, timeline, onToggle, onCancel }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>From</th>
          <th>To</th>
          <th>Days</th>
          <th>Status</th>
          <th>Remarks</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {leaves.map((l) => (
          <LeaveRow
            key={l._id}
            leave={l}
            isOpen={openId === l._id}
            timeline={timeline}
            onToggle={onToggle}
            onCancel={onCancel}
          />
        ))}
        {!leaves.length && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No leave requests yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await leaveService.getMyLeaves();
      setLeaves(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id) {
    if (!confirm("Cancel this pending leave?")) return;
    try {
      await leaveService.cancelLeave(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed");
    }
  }

  async function toggleTimeline(id) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    const res = await leaveService.getLeave(id);
    setTimeline(res.data.timeline || []);
    setOpenId(id);
  }

  return (
    <div className="page">
      <h2>My Leaves</h2>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <LeavesTable
          leaves={leaves}
          openId={openId}
          timeline={timeline}
          onToggle={toggleTimeline}
          onCancel={cancel}
        />
      )}
    </div>
  );
}
