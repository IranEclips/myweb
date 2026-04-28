import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export const config = {
  api: { bodyParser: false },
  supportsResponseStreaming: true,
};


const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");
const SECRET_KEY = process.env.SECRET_KEY || "my-default-secret"; 


const BANNED_HEADERS = new Set([
  "host", "connection", "keep-alive", "proxy-authenticate", 
  "proxy-authorization", "te", "trailer", "transfer-encoding", 
  "upgrade", "forwarded", "x-forwarded-host", "x-forwarded-proto", 
  "x-forwarded-port", "x-vercel-id", "x-vercel-cache", "x-vercel-forwarded-for"
]);

export default async function handler(req, res) {
 
  if (!TARGET_BASE) {
    res.statusCode = 500;
    return res.end("Configuration Error: TARGET_DOMAIN is missing.");
  }

  try {
    const headers = {};
    const clientKey = req.headers["x-access-key"]; 

   
    if (clientKey !== SECRET_KEY) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.statusCode = 200;
      return res.end(`
        <!DOCTYPE html>
        <html>
          <head><title>Under Construction</title></head>
          <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>Maintenance Mode</h1>
            <p>Our website is currently undergoing scheduled maintenance.</p>
          </body>
        </html>
      `);
    }

   
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
    console.error("Tunnel Error:", err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Bad Gateway: Connection to origin failed.");
    }
  }
}