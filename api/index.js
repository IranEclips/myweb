export const config = { runtime: "edge" };

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

export default async function handler(req) {
  const url = new URL(req.url);


  const accept = req.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");


  if (url.pathname === "/" && isBrowser) {
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IRNA ECLIPS</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  height: 100vh;
  background: #0a0f1c;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
}


body::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #00c6ff33, transparent 40%);
  animation: move 10s linear infinite;
}
@keyframes move {
  0% { transform: translate(-25%, -25%); }
  50% { transform: translate(-10%, -10%); }
  100% { transform: translate(-25%, -25%); }
}

.container {
  position: relative;
  text-align: center;
  z-index: 2;
}

h1 {
  font-size: 60px;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  margin-top: 10px;
  opacity: 0.7;
}

.badge {
  margin-top: 25px;
  padding: 12px 25px;
  border-radius: 30px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  display: inline-block;
}

.footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  opacity: 0.4;
}
</style>
</head>

<body>
  <div class="container">
    <h1>IRNA ECLIPS</h1>
    <p>Next Generation Tunnel System</p>
    <div class="badge">⚡ Secure • Fast • Smart Routing</div>
  </div>

  <div class="footer">
    Powered by Edge Network
  </div>
</body>
</html>`, {
      headers: { "content-type": "text/html" },
    });
  }


  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  return fetch(TARGET_BASE + req.url.substring(req.url.indexOf("/", 8)), {
    method: req.method,
    headers: headers,
    body: req.body,
    duplex: "half",
    redirect: "manual",
  });
}
