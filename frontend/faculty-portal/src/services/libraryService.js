import api from "../api/client";

/**
 * Centralized Library API client (Task 12.25).
 * Talks to the API Gateway (/api/books and /api/library). Reusable across portals.
 */
const BOOKS = "/api/books";
const LIB = "/api/library";

export function getBooks(params = {}) {
  return api.get(BOOKS, { params }).then((r) => r.data);
}

export function getBook(id) {
  return api.get(`${BOOKS}/${id}`).then((r) => r.data);
}

export function createBook(payload) {
  return api.post(BOOKS, payload).then((r) => r.data);
}

export function updateBook(id, payload) {
  return api.put(`${BOOKS}/${id}`, payload).then((r) => r.data);
}

export function deleteBook(id) {
  return api.delete(`${BOOKS}/${id}`).then((r) => r.data);
}

export function issueBook(id, payload) {
  return api.post(`${BOOKS}/${id}/issue`, payload).then((r) => r.data);
}

export function returnBook(id, payload) {
  return api.post(`${BOOKS}/${id}/return`, payload).then((r) => r.data);
}

export function getMyBooks() {
  return api.get(`${LIB}/my-books`).then((r) => r.data);
}

export function getFines() {
  return api.get(`${LIB}/fines`).then((r) => r.data);
}

export function getReports() {
  return api.get(`${LIB}/reports`).then((r) => r.data);
}

export function getAnalytics() {
  return api.get(`${LIB}/analytics`).then((r) => r.data);
}

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getMyBooks,
  getFines,
  getReports,
  getAnalytics,
};
