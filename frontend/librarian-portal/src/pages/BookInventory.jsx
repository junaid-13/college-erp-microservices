import { useEffect, useState, useCallback } from "react";

import BookForm from "../components/BookForm";
import libraryService from "../services/libraryService";

/**
 * Librarian inventory management (Task 12.27). Add / update / remove books.
 */

function ErrorBanner({ error }) {
  return error ? <div className="error-banner">{error}</div> : null;
}

function EditBook({ editing, handleUpdate, setEditing }) {
  if (!editing) return null;

  return (
    <div className="edit-block">
      <h3>Edit — {editing.title}</h3>

      <BookForm
        initial={editing}
        onSubmit={handleUpdate}
        submitLabel="Update Book"
        isbnReadOnly
      />

      <button className="ghost" onClick={() => setEditing(null)}>
        Cancel edit
      </button>
    </div>
  );
}

function InventoryActions({
  creating,
  editing,
  handleCreate,
  handleUpdate,
  setEditing,
}) {
  return (
    <>
      {creating && <BookForm onSubmit={handleCreate} submitLabel="Add Book" />}

      <EditBook
        editing={editing}
        handleUpdate={handleUpdate}
        setEditing={setEditing}
      />
    </>
  );
}

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

function BooksTable({ books, setEditing, handleDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Category</th>
          <th>Avail/Total</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {books.map((b) => (
          <tr key={b._id} style={{ opacity: b.status === "ACTIVE" ? 1 : 0.5 }}>
            <td>{b.isbn}</td>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.category}</td>

            <td>
              {b.availableCopies}/{b.totalCopies}
            </td>

            <td>{b.status}</td>

            <td className="actions">
              <button onClick={() => setEditing(b)}>Edit</button>
              <button onClick={() => handleDelete(b._id)}>Remove</button>
            </td>
          </tr>
        ))}

        {!books.length && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No books.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function BooksContent({ loading, books, setEditing, handleDelete }) {
  return loading ? (
    <p>Loading…</p>
  ) : (
    <BooksTable
      books={books}
      setEditing={setEditing}
      handleDelete={handleDelete}
    />
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

async function createBook(payload) {
  return libraryService.createBook(payload);
}

async function updateBook(id, payload) {
  const { isbn, _id, availableCopies, status, ...rest } = payload;
  return libraryService.updateBook(id, rest);
}

async function deleteBook(id) {
  return libraryService.deleteBook(id);
}

function useBookActions({
  page,
  search,
  editing,
  setBooks,
  setPagination,
  setLoading,
  setError,
  setCreating,
  setEditing,
}) {
  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page, limit: 20, includeInactive: "true" };

      if (search) params.search = search;

      const res = await libraryService.getBooks(params);

      setBooks(res.data || []);
      setPagination(
        res.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  }, [page, search, setBooks, setPagination, setLoading, setError]);

  const handleCreate = async (payload) => {
    await createBook(payload);
    setCreating(false);
    load();
  };

  const handleUpdate = async (payload) => {
    await updateBook(editing._id, payload);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this book?")) return;

    await deleteBook(id);
    load();
  };

  return { load, handleCreate, handleUpdate, handleDelete };
}

export default function BookInventory() {
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
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const { load, handleCreate, handleUpdate, handleDelete } = useBookActions({
    page,
    search,
    editing,
    setBooks,
    setPagination,
    setLoading,
    setError,
    setCreating,
    setEditing,
  });

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Book Inventory ({pagination.total})</h2>

        <button className="btn" onClick={() => setCreating((c) => !c)}>
          {creating ? "Close" : "+ Add Book"}
        </button>
      </div>

      <ErrorBanner error={error} />

      <InventoryActions
        creating={creating}
        editing={editing}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        setEditing={setEditing}
      />

      <SearchForm search={search} setSearch={setSearch} setPage={setPage} />

      <BooksContent
        loading={loading}
        books={books}
        setEditing={setEditing}
        handleDelete={handleDelete}
      />

      <Pagination page={page} pagination={pagination} setPage={setPage} />
    </div>
  );
}
