import crypto from "crypto";

export const SESSION_COOKIE_NAME = "pm_session";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random string to your .env file (see .env.example)."
    );
  }
  return secret;
}

export function signSessionId(sessionId: string): string {
  const signature = crypto.createHmac("sha256", getSecret()).update(sessionId).digest("hex");
  return `${sessionId}.${signature}`;
}

/**
 * Verifies the signature only — no DB call, safe for edge/middleware use.
 * Full validation (expiry, revocation, active user) happens in
 * getCurrentUser() (src/lib/auth.ts).
 */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [sessionId, signature] = token.split(".");
  if (!sessionId || !signature) return null;

  const expected = crypto.createHmac("sha256", getSecret()).update(sessionId).digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  return sessionId;
}
