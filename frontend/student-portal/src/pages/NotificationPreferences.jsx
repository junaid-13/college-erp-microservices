/**
 * Notification preferences (Task 15.25).
 *
 * Canonical shared page mirrored into each portal's pages/.
 * Toggles for email / in-app / WhatsApp channels and per-module
 * preferences, plus the WhatsApp number used for delivery.
 *
 * @param {object} service  the portal's notificationService client
 */
import { useEffect, useState } from "react";

const TOGGLES = [
  { key: "emailNotifications", label: "Email notifications" },
  { key: "inAppNotifications", label: "In-app notifications" },
  { key: "whatsappNotifications", label: "WhatsApp notifications" },
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
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    service
      .getPreferences()
      .then((res) => {
        setPrefs(res.data);
        setWhatsappNumber(res.data?.whatsappNumber || "");
      })
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

  async function saveWhatsappNumber() {
    setMessage("");
    setError("");
    try {
      const res = await service.updatePreferences({ whatsappNumber });
      setPrefs(res.data);
      setMessage("WhatsApp number saved.");
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

      <section className="detail-block">
        <h3>WhatsApp Number</h3>
        <label>
          Number
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
        <button onClick={saveWhatsappNumber}>Save Number</button>
      </section>
    </div>
  );
}
