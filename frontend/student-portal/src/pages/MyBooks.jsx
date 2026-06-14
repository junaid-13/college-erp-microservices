import { useEffect, useState } from "react";

import libraryService from "../services/libraryService";
import { estimateFine } from "../utils/libraryHelpers";

/**
 * Borrowing history (Task 12.29). Shared between student & faculty portals.
 * Current + returned books with dates and fines.
 */
function BookRow({ item, showReturn }) {
  return (
    <tr>
      <td>{item.book?.title || item.bookId}</td>
      <td>{item.issueDate?.slice(0, 10)}</td>
      <td>{item.dueDate?.slice(0, 10)}</td>
      {showReturn && <td>{item.returnDate?.slice(0, 10) || "—"}</td>}
      <td>
        {showReturn
          ? `₹${item.fineAmount || 0}`
          : `₹${estimateFine(item.dueDate)} (est.)`}
      </td>
    </tr>
  );
}

function BooksSection({ title, items, columns, showReturn }) {
  return (
    <section className="detail-block">
      <h3>
        {title} ({items.length})
      </h3>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <BookRow key={i._id} item={i} showReturn={showReturn} />
          ))}
          {!items.length && (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                None
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

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

  return (
    <div className="page">
      <h2>My Books</h2>

      {fines && (
        <p>
          Outstanding fines: <strong>₹{fines.totalOutstanding}</strong>
        </p>
      )}

      <BooksSection
        title="Current"
        items={data.current}
        columns={["Title", "Issued", "Due", "Fine"]}
        showReturn={false}
      />

      <BooksSection
        title="Returned"
        items={data.returned}
        columns={["Title", "Issued", "Due", "Returned", "Fine"]}
        showReturn
      />
    </div>
  );
}
