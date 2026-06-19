import { useEffect, useState, useCallback } from "react";

import libraryService from "../services/libraryService";
import { isAvailable } from "../utils/libraryHelpers";

/**
 * Book catalog (Task 12.26). Shared between student & faculty portals.
 * Search + browse books with availability.
 */

function SearchForm({ search, setSearch, setPage }) {
  return (
    <form
      className="student-search"
      onSubmit={(e) => {
        e.preventDefault();
        setPage(1);
      }}
    >
      <input
        type="search"
        placeholder="Search title/author/ISBN/category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

function BooksTable({ books }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Category</th>
          <th>Rack</th>
          <th>Availability</th>
        </tr>
      </thead>

      <tbody>
        {books.map((b) => (
          <tr key={b._id}>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.category}</td>
            <td>{b.rackNumber || "—"}</td>
            <td>
              {isAvailable(b) ? (
                <span className="flag flag-APPROVED">
                  {b.availableCopies} available
                </span>
              ) : (
                <span className="flag flag-REJECTED">Out of stock</span>
              )}
            </td>
          </tr>
        ))}

        {!books.length && (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No books found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function Pagination({ page, pagination, setPage }) {
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
        Prev
      </button>

      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        disabled={page >= pagination.totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default function Library() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page, limit: 20 };

      if (search) params.search = search;

      const res = await libraryService.getBooks(params);

      setBooks(res.data || []);
      setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <h2>Library Catalog ({pagination.total})</h2>

      <SearchForm search={search} setSearch={setSearch} setPage={setPage} />

      {error && <div className="error-banner">{error}</div>}

      {loading ? <p>Loading…</p> : <BooksTable books={books} />}

      <Pagination page={page} pagination={pagination} setPage={setPage} />
    </div>
  );
}
