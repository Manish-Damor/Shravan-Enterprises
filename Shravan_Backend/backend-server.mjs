import { createServer } from "node:http";
import { Readable } from "node:stream";

const { default: worker } = await import("./dist/server/index.js");

if (!worker || typeof worker.fetch !== "function") {
  throw new Error("dist/server/index.js does not export a worker with fetch()");
}

function toRequest(req) {
  const host = req.headers.host || "127.0.0.1";
  const url = new URL(req.url || "/", `http://${host}`);
  const method = req.method || "GET";
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    } else if (value != null) {
      headers.set(key, value);
    }
  }

  const body =
    method === "GET" || method === "HEAD" ? void 0 : Readable.toWeb(req);

  return new Request(url, { method, headers, body, duplex: "half" });
}

async function sendResponse(nodeRes, response) {
  nodeRes.statusCode = response.status;
  nodeRes.statusMessage = response.statusText;

  response.headers.forEach((value, key) => {
    nodeRes.setHeader(key, value);
  });

  if (!response.body) {
    nodeRes.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(nodeRes);
}

const port = Number(process.env.HTTP_PLATFORM_PORT || process.env.PORT || "8082");
const host = process.env.HOST || "127.0.0.1";

const server = createServer(async (req, res) => {
  try {
    const request = toRequest(req);
    const response = await worker.fetch(request, {}, {});
    await sendResponse(res, response);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
});
