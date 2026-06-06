import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const root = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  let file = path.join(root, pathname);

  if (!file.startsWith(root) || !existsSync(file)) file = path.join(root, "index.html");

  try {
    const info = await stat(file);
    response.writeHead(200, {
      "Content-Type": types.get(path.extname(file)) || "application/octet-stream",
      "Content-Length": info.size,
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Preview running at http://localhost:${port}`);
});
