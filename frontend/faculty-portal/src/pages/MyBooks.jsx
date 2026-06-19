import { useEffect, useState } from "react";

import libraryService from "../services/libraryService";
import { estimateFine } from "../utils/libraryHelpers";

/**
 * Borrowing history (Task 12.29). Shared between student & faculty portals.
 * Current + returned books with dates and fines.
 */

function BookRow({ i, showReturn }) {
  return (
    <tr>
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
}

function BooksSection({ title, books, showReturn }) {
  return (
    <section className="detail-block">
      <h3>
        {title} ({books.length})
      </h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Issued</th>
            <th>Due</th>
            {showReturn && <th>Returned</th>}
            <th>Fine</th>
          </tr>
        </thead>

        <tbody>
          {books.map((i) => (
            <BookRow key={i._id} i={i} showReturn={showReturn} />
          ))}

          {!books.length && (
            <tr>
              <td colSpan={showReturn ? 5 : 4} style={{ textAlign: "center" }}>
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

      <BooksSection title="Current" books={data.current} showReturn={false} />

      <BooksSection title="Returned" books={data.returned} showReturn />
    </div>
  );
}
