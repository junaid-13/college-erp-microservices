import { useEffect, useState, useCallback } from "react";

/**
 * Notification center (Task 15.24).
 *
 * Canonical shared page mirrored into each portal's pages/.
 * Lists notifications with read status + date, supports pagination and
 * mark-as-read.
 *
 * @param {object} service the portal's notificationService client
 */

function NotificationsTable({ items, read }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Message</th>
          <th>Status</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {items.map((n) => (
          <tr key={n._id} style={{ fontWeight: n.isRead ? "normal" : 600 }}>
            <td>{n.title}</td>
            <td>{n.message}</td>
            <td>{n.isRead ? "Read" : "Unread"}</td>
            <td>
              {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
            </td>
            <td>
              {!n.isRead && (
                <button onClick={() => read(n._id)}>Mark read</button>
              )}
            </td>
          </tr>
        ))}

        {!items.length && (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No notifications.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function NotificationsPagination({ page, pagination, setPage }) {
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

function useNotifications(service, page) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await service.getNotifications({
        page,
        limit: 20,
      });

      setItems(res.data || []);
      setPagination(
        res.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, service]);

  const read = async (id) => {
    await service.markAsRead(id);
    load();
  };

  const readAll = async () => {
    await service.markAllAsRead();
    load();
  };

  return {
    items,
    pagination,
    loading,
    error,
    load,
    read,
    readAll,
  };
}

export default function Notifications({ service }) {
  const [page, setPage] = useState(1);

  const { items, pagination, loading, error, load, read, readAll } =
    useNotifications(service, page);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Notifications ({pagination.total})</h2>

        <button className="btn" onClick={readAll}>
          Mark all read
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <NotificationsTable items={items} read={read} />
      )}

      <NotificationsPagination
        page={page}
        pagination={pagination}
        setPage={setPage}
      />
    </div>
  );
}
