import { useEffect, useState } from "react";

import notificationService from "../services/notificationService";

/**
 * Admin notification analytics dashboard (Task 15.26).
 * Sent / failed counts, read rate, delivery rate.
 */
export default function NotificationDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load analytics"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;
  if (!data) return <div className="page">No data.</div>;

  return (
    <div className="page">
      <h2>Notification Analytics</h2>
      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-num">{data.sent}</span>
          <span>Sent</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{data.failed}</span>
          <span>Failed</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{data.readRate}%</span>
          <span>Read Rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{data.deliveryRate}%</span>
          <span>Delivery Rate</span>
        </div>
      </div>

      <section className="detail-block">
        <h3>Breakdown</h3>
        <p>
          Total notifications: <strong>{data.total}</strong>
        </p>
        <p>
          Delivered: <strong>{data.delivered}</strong>
        </p>
        <p>
          Read (in-app): <strong>{data.read}</strong> · Unread:{" "}
          <strong>{data.unread}</strong>
        </p>
      </section>
    </div>
  );
}
