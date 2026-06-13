/**
 * Notification bell (Task 15.23).
 *
 * Canonical shared component. Each portal is an independent Vite app, so this
 * file is the source of truth and is mirrored into each portal's components/.
 *
 * Shows the unread count and a dropdown of recent notifications. Polls the
 * unread count periodically so the badge updates automatically.
 *
 * @param {object} service  the portal's notificationService client
 * @param {string} centerPath  route to the full notification center
 */
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

export default function NotificationBell({
  service,
  centerPath = "/notifications",
}) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);

  const loadCount = useCallback(async () => {
    try {
      const res = await service.getUnreadCount();
      setCount(res.count || 0);
    } catch (_) {
      /* ignore */
    }
  }, [service]);

  useEffect(() => {
    loadCount();
    const t = setInterval(loadCount, 30000); // auto-update every 30s
    return () => clearInterval(t);
  }, [loadCount]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      try {
        const res = await service.getNotifications({ limit: 5 });
        setRecent(res.data || []);
      } catch (_) {
        setRecent([]);
      }
    }
  }

  async function read(id) {
    await service.markAsRead(id);
    loadCount();
    setRecent((r) => r.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  }

  return (
    <span className="notif-bell">
      <button
        className="notif-bell-btn"
        onClick={toggle}
        aria-label="Notifications"
      >
        🔔
        {count > 0 && (
          <span className="notif-badge">{count > 99 ? "99+" : count}</span>
        )}
      </button>
      {open && (
        <div className="notif-dropdown" onMouseLeave={() => setOpen(false)}>
          <div className="notif-dropdown-head">
            <strong>Notifications</strong>
            <Link to={centerPath} onClick={() => setOpen(false)}>
              View all
            </Link>
          </div>
          {recent.length ? (
            recent.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${n.isRead ? "" : "unread"}`}
                onClick={() => read(n._id)}
              >
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
              </div>
            ))
          ) : (
            <div className="notif-item">No notifications.</div>
          )}
        </div>
      )}
    </span>
  );
}
