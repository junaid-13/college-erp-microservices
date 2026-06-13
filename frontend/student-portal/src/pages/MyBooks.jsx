import { useEffect, useState } from "react";

import libraryService from "../services/libraryService";
import { estimateFine } from "../utils/libraryHelpers";

/**
 * Borrowing history (Task 12.29). Shared between student & faculty portals.
 * Current + returned books with dates and fines.
 */
export default function MyBooks() {
  const [data, setData] = useState({ current: [], returned: [] });
  const [fines, setFines] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([libraryService.getMyBooks(), libraryService.getFines()])
      .then(([b, f]) => {
        setData(b.data || { current: [], returned: [] });
        setFines(f.data);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load books"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;

  const row = (i, showReturn) => (
    <tr key={i._id}>
      <td>{i.book?.title || i.bookId}</td>
      <td>{i.issueDate?.slice(0, 10)}</td>
      <td>{i.dueDate?.slice(0, 10)}</td>
      {showReturn && <td>{i.returnDate?.slice(0, 10) || "—"}</td>}
      <td>
        {showReturn
          ? `₹${i.fineAmount || 0}`
          : `₹${estimateFine(i.dueDate)} (est.)`}
      </td>
    </tr>
  );

  return (
    <div className="page">
      <h2>My Books</h2>

      {fines && (
        <p>
          Outstanding fines: <strong>₹{fines.totalOutstanding}</strong>
        </p>
      )}

      <section className="detail-block">
        <h3>Current ({data.current.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {data.current.map((i) => row(i, false))}
            {!data.current.length && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="detail-block">
        <h3>Returned ({data.returned.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Returned</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {data.returned.map((i) => row(i, true))}
            {!data.returned.length && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
