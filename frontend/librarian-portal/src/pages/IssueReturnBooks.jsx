import { useState } from "react";

import libraryService from "../services/libraryService";
import { isAvailable } from "../utils/libraryHelpers";

/**
 * Librarian issue / return management (Task 12.28).
 * Search a book, then issue to a user or accept a return.
 */

function isValidUserId(userId) {
  return /^[0-9a-fA-F]{24}$/.test(userId.trim());
}

function resetMessages(setError, setMessage) {
  setError("");
  setMessage("");
}

async function issueBook(selected, form) {
  return libraryService.issueBook(selected._id, {
    userId: form.userId.trim(),
    userType: form.userType,
    userEmail: form.userEmail.trim() || undefined,
  });
}

async function returnBook(selected, form) {
  return libraryService.returnBook(selected._id, {
    userId: form.userId.trim(),
  });
}

function Messages({ error, message }) {
  return (
    <>
      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}
    </>
  );
}

function SearchForm({ search, setSearch, findBooks }) {
  return (
    <form className="student-search" onSubmit={findBooks}>
      <input
        type="search"
        placeholder="Find book by title/author/ISBN…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

function BooksTable({ books, selected, setSelected }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Avail/Total</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {books.map((b) => (
          <tr
            key={b._id}
            style={{
              background: selected?._id === b._id ? "#eef2ff" : "",
            }}
          >
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>
              {b.availableCopies}/{b.totalCopies}{" "}
              {isAvailable(b) ? "" : "(none)"}
            </td>
            <td>
              <button onClick={() => setSelected(b)}>Select</button>
            </td>
          </tr>
        ))}

        {!books.length && (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              Search to find books.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function TransactionPanel({ selected, form, set, issue, accept }) {
  if (!selected) return null;

  return (
    <section className="detail-block">
      <h3>Transaction — {selected.title}</h3>

      <div className="student-filters">
        <input
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => set("userId", e.target.value)}
        />

        <select
          value={form.userType}
          onChange={(e) => set("userType", e.target.value)}
        >
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Faculty</option>
        </select>

        <input
          placeholder="User Email (optional)"
          value={form.userEmail}
          onChange={(e) => set("userEmail", e.target.value)}
        />
      </div>

      <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
        <button onClick={issue} disabled={!isAvailable(selected)}>
          Issue Book
        </button>

        <button className="ghost" onClick={accept}>
          Accept Return
        </button>
      </div>
    </section>
  );
}

export default function IssueReturnBooks() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    userType: "STUDENT",
    userEmail: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function findBooks(e) {
    e?.preventDefault();
    resetMessages(setError, setMessage);

    try {
      const res = await libraryService.getBooks({ search, limit: 10 });
      setBooks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function issue() {
    resetMessages(setError, setMessage);

    if (!isValidUserId(form.userId)) {
      setError("Enter a valid user id.");
      return;
    }

    try {
      await issueBook(selected, form);
      setMessage(`Issued "${selected.title}" to ${form.userId}.`);
      findBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Issue failed");
    }
  }

  async function accept() {
    resetMessages(setError, setMessage);

    if (!isValidUserId(form.userId)) {
      setError("Enter a valid user id.");
      return;
    }

    try {
      const res = await returnBook(selected, form);
      const fine = res.issue?.fineAmount || 0;

      setMessage(`Return accepted${fine ? ` — fine ₹${fine} generated` : ""}.`);

      findBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Return failed");
    }
  }

  return (
    <div className="page">
      <h2>Issue / Return Books</h2>

      <SearchForm search={search} setSearch={setSearch} findBooks={findBooks} />

      <Messages error={error} message={message} />

      <BooksTable books={books} selected={selected} setSelected={setSelected} />

      <TransactionPanel
        selected={selected}
        form={form}
        set={set}
        issue={issue}
        accept={accept}
      />
    </div>
  );
}
