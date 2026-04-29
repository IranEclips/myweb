export const config = { runtime: "edge" };

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

export default async function handler(req) {
  const url = new URL(req.url);
  const accept = req.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");

 
  if (url.pathname === "/" && isBrowser) {
    return new Response(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<title>Eclips Edge</title>
<style>
  body { background: #0a0f1c; color: #fff; font-family: Tahoma, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .box { text-align: center; border: 1px solid #00c6ff; padding: 40px; border-radius: 20px; box-shadow: 0 0 20px #00c6ff44; }
  h1 { color: #00c6ff; margin-bottom: 10px; }
  p { opacity: 0.8; }
</style>
</head>
<body>
  <div class="box">
    <h1>Eclips Edge System</h1>
    <p>سیستم هوشمند مدیریت ترافیک لبه</p>
    <div style="margin-top: 20px; font-size: 14px; color: #0072ff;">وضعیت سرویس: فعال ⚡</div>
  </div>
</body>
</html>`, {
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
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
  } catch (e) {
    return new Response("Edge Connection Error", { status: 502 });
  }
}