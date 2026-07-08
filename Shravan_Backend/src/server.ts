import "./lib/error-capture";

import { handleApiRequest } from "./server/api";

// eslint-disable-next-line no-console
console.log("backend is running");

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
};

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (url.pathname.startsWith("/api/")) {
        return withCors(await handleApiRequest(request));
      }

      if (url.pathname === "/" || url.pathname === "/health") {
        return new Response("backend is running", {
          status: 200,
          headers: { "content-type": "text/plain; charset=utf-8", ...corsHeaders },
        });
      }

      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", ...corsHeaders },
      });
    } catch (error) {
      console.error(error);
      return new Response("backend is running", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8", ...corsHeaders },
      });
    }
  },
};
