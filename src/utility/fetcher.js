export const config = { runtime: "edge" };

export default async function handler(req) {
  const url = new URL(req.url);
  const accept = req.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");

  if (url.pathname === "/" && isBrowser) {
    return new Response(
      `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IranEclips | Arvin Vahed</title>
    <style>
        body { background: #0a0f1c; color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: rgba(255, 255, 255, 0.03); padding: 3rem; border-radius: 2rem; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); text-align: center; width: 90%; max-width: 450px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #00c6ff, #0072ff); border-radius: 20px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; transform: rotate(-10deg); }
        h1 { margin: 0; font-size: 1.8rem; background: linear-gradient(90deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #94a3b8; margin: 1rem 0 2rem; line-height: 1.6; }
        .btn { display: block; text-decoration: none; padding: 1rem; margin: 0.5rem 0; border-radius: 12px; font-weight: bold; transition: 0.3s; }
        .yt { background: #ff0000; color: #white; }
        .tg { background: #229ED9; color: #white; }
        .btn:hover { transform: scale(1.03); filter: brightness(1.1); }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">IE</div>
        <h1>IranEclips</h1>
        <p>مرجع آموزش‌های تخصصی شبکه، لینوکس و امنیت در دنیای تکنولوژی</p>
        <a href="https://www.youtube.com/@iranEclips" target="_blank" class="btn yt">🎥 کانال یوتیوب ما</a>
        <a href="https://t.me/IranEclip" target="_blank" class="btn tg">📢 کانال تلگرام</a>
    </div>
</body>
</html>`,
      {
        headers: { "content-type": "text/html; charset=UTF-8" },
      }
    );
  }

  const targetBase = process.env.iraneclips;

  if (!targetBase) {
    return new Response("Storage Config Missing", { status: 500 });
  }

  const cleanBase = targetBase.replace(/\/$/, "");
  const targetUrl = `${cleanBase}${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  try {
    return await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      duplex: "half",
      redirect: "manual",
    });
  } catch (e) {
    return new Response("Service Node Error", { status: 502 });
  }
}
