import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export const config = {
  api: { bodyParser: false },
  supportsResponseStreaming: true,
};


const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const SECRET_KEY = process.env.SECRET_KEY || "iran eclips"; 

const BANNED_HEADERS = new Set([
  "host", "connection", "keep-alive", "proxy-authenticate", 
  "proxy-authorization", "te", "trailer", "transfer-encoding", 
  "upgrade", "forwarded", "x-forwarded-host", "x-forwarded-proto", 
  "x-forwarded-port"
]);

export default async function handler(req, res) {
  if (!TARGET_BASE) {
    res.statusCode = 500;
    return res.end("Error: TARGET_DOMAIN is not set in Vercel Environment Variables.");
  }

  try {
    const clientKey = req.headers["x-access-key"];

    
    if (clientKey !== SECRET_KEY) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.statusCode = 200;
      return res.end(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
          <head>
            <title>Iran Eclips | ?? ??? ?????</title>
            <style>
              body { background: #0a0a0a; color: #00d2ff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
              .container { text-align: center; border: 1px solid #333; padding: 40px; border-radius: 15px; box-shadow: 0 0 20px rgba(0, 210, 255, 0.2); }
              h1 { font-size: 2.5rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
              p { color: #888; font-size: 1.1rem; }
              .neon { text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="neon">Iran Eclips</h1>
              <p>??? ????? ?? ??? ??????????? ???????. ????? ????? ?????? ????.</p>
            </div>
          </body>
        </html>
      `);
    }

  
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const k = key.toLowerCase();
      if (BANNED_HEADERS.has(k) || k.startsWith("x-vercel-")) continue;
      headers[k] = Array.isArray(value) ? value.join(", ") : value;
    }

    const targetUrl = TARGET_BASE + req.url;
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? Readable.toWeb(req) : null,
      duplex: "half",
      redirect: "manual"
    });

    res.statusCode = response.status;
    for (const [k, v] of response.headers) {
      if (k.toLowerCase() === "transfer-encoding") continue;
      try { res.setHeader(k, v); } catch (e) {}
    }

    if (response.body) {
      await pipeline(Readable.fromWeb(response.body), res);
    } else {
      res.end();
    }

  } catch (err) {
    console.error("Relay Error:", err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Bad Gateway");
    }
  }
}