const BACKEND_BASE_URL = (
  process.env.IRAN_ECLIPS_BACKEND ||
  process.env.TARGET_DOMAIN ||
  ""
).replace(/\/$/, "");

const STRIP_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

function buildTargetUrl(requestUrl, backendBaseUrl) {
  const pathStart = requestUrl.indexOf("/", 8);
  return pathStart === -1
    ? backendBaseUrl + "/"
    : backendBaseUrl + requestUrl.slice(pathStart);
}

function buildOutboundHeaders(inboundHeaders) {
  const outboundHeaders = new Headers();
  let clientIp = null;

  for (const [headerName, headerValue] of inboundHeaders) {
    if (STRIP_HEADERS.has(headerName)) continue;
    if (headerName.startsWith("x-vercel-")) continue;

    if (headerName === "x-real-ip") {
      clientIp = headerValue;
      continue;
    }

    if (headerName === "x-forwarded-for") {
      if (!clientIp) clientIp = headerValue;
      continue;
    }

    outboundHeaders.set(headerName, headerValue);
  }

  if (clientIp) outboundHeaders.set("x-forwarded-for", clientIp);
  return outboundHeaders;
}

export function getBackendBaseUrl() {
  return BACKEND_BASE_URL;
}

export async function forwardXhttpRequest(req, backendBaseUrl) {
  const targetUrl = buildTargetUrl(req.url, backendBaseUrl);
  const headers = buildOutboundHeaders(req.headers);

  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  return await fetch(targetUrl, {
    method,
    headers,
    body: hasBody ? req.body : undefined,
    duplex: "half",
    redirect: "manual",
  });
}
