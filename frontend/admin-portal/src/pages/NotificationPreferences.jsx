/**
 * Notification preferences (Task 15.25).
 *
 * Canonical shared page mirrored into each portal's pages/.
 * Toggles for email / in-app and per-module preferences.
 *
 * @param {object} service  the portal's notificationService client
 */
import { useEffect, useState } from "react";

const TOGGLES = [
  { key: "emailNotifications", label: "Email notifications" },
  { key: "inAppNotifications", label: "In-app notifications" },
  { key: "leaveNotifications", label: "Leave" },
  { key: "assessmentNotifications", label: "Assessments" },
  { key: "marksNotifications", label: "Marks" },
  { key: "attendanceNotifications", label: "Attendance" },
  { key: "timetableNotifications", label: "Timetable" },
];

export default function NotificationPreferences({ service }) {
  const [prefs, setPrefs] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service
      .getPreferences()
      .then((res) => setPrefs(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load preferences"),
      )
      .finally(() => setLoading(false));
  }, [service]);

  async function toggle(key) {
    setMessage("");
    setError("");
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await service.updatePreferences({ [key]: next[key] });
      setMessage("Preferences updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  }

  if (loading) return <div className="page">Loading…</div>;
  if (error && !prefs) return <div className="page error-banner">{error}</div>;

  return (
    <div className="page">
      <h2>Notification Preferences</h2>
      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <section className="detail-block">
        {TOGGLES.map((t) => (
          <label key={t.key} className="pref-toggle">
            <input
              type="checkbox"
              checked={Boolean(prefs?.[t.key])}
              onChange={() => toggle(t.key)}
            />
            {t.label}
          </label>
        ))}
      </section>
    </div>
  );
}
