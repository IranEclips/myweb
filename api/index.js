export const config = { runtime: "edge" };

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

export default async function handler(req) {
  const url = new URL(req.url);
  const accept = req.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");

  if (url.pathname === "/" && isBrowser) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Core Edge System</title>
    <style>
        body { background: #050a15; color: #00d4ff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { border: 1px solid #00d4ff; padding: 50px; border-radius: 15px; text-align: center; box-shadow: 0 0 15px rgba(0,212,255,0.3); }
        h1 { margin: 0; letter-spacing: 2px; }
        p { color: #888; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>CORE SYSTEM</h1>
        <p>Edge Logic is Running Smoothly</p>
    </div>
</body>
</html>`,
      {
        headers: { "content-type": "text/html; charset=UTF-8" },
      }
    );
  }

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  const targetUrl = `${TARGET_BASE}${url.pathname}${url.search}`;

  try {
    return await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) {
    return new Response("Gateway Error", { status: 502 });
  }
}
