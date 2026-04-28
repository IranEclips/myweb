import { forwardXhttpRequest, getBackendBaseUrl } from "../core/tunnel.gateway.js";

export const config = { runtime: "edge" };

const BACKEND_BASE_URL = getBackendBaseUrl();

export default async function requestRouter(req) {
  if (!BACKEND_BASE_URL) {
    return new Response(
      "Misconfigured: IRAN_ECLIPS_BACKEND (or legacy TARGET_DOMAIN) is not set",
      { status: 500 }
    );
  }

  try {
    return await forwardXhttpRequest(req, BACKEND_BASE_URL);
  } catch (err) {
    console.error("tunnel error:", err);
    return new Response("Bad Gateway: Tunnel Failed", { status: 502 });
  }
}
