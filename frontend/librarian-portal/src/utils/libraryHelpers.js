/**
 * Pure helpers shared by the library UI (mirrors backend fine calculator).
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dayOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Whole days overdue (0 if not overdue). */
export function overdueDays(dueDate, asOf = new Date()) {
  const due = dayOnly(dueDate);
  const now = dayOnly(asOf);
  if (now <= due) return 0;
  return Math.round((now - due) / MS_PER_DAY);
}

/** Estimated fine at ₹perDay. */
export function estimateFine(dueDate, asOf = new Date(), perDay = 5) {
  return overdueDays(dueDate, asOf) * perDay;
}

/** True when availableCopies > 0. */
export function isAvailable(book) {
  return (book?.availableCopies ?? 0) > 0;
}

/** Validate an add/edit book form. */
export function validateBook(form) {
  const e = {};
  if (!form.isbn || !/^(\d{9}[\dXx]|\d{13})$/.test(form.isbn))
    e.isbn = "Valid 10 or 13 digit ISBN required";
  if (!form.title || !form.title.trim()) e.title = "Title is required";
  if (!form.totalCopies || Number(form.totalCopies) < 1)
    e.totalCopies = "Total copies must be greater than 0";
  return e;
}
