// Minimal zero-dependency static file server for the built Vite SPA.
// Serves files from ./dist and falls back to index.html for client-side routes.
import console from "node:console";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { join, normalize, extname } from "node:path";
import process from "node:process";

const ROOT = join(process.cwd(), "dist");
const PORT = process.env.PORT || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

async function send(res, filePath) {
  const body = await readFile(filePath);
  res.writeHead(200, {
    "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    // Strip query string and prevent path traversal.
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(ROOT, safePath);

    try {
      const info = await stat(filePath);
      if (info.isDirectory()) filePath = join(filePath, "index.html");
      await send(res, filePath);
    } catch {
      // SPA fallback: unknown route -> index.html (React Router handles it).
      await send(res, join(ROOT, "index.html"));
    }
  } catch {
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(PORT, () => console.log(`student-portal serving on :${PORT}`));
