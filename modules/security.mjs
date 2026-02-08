import { createHmac } from "node:crypto";

function securityAudit(req, res, next) {
  // Always continue for non-POST requests
  if (req.method !== "POST") return next();

  // If there's no password in the request, nothing to do
  if (!req.body?.password) return next();

  const secret = process.env.SECRET;
  if (!secret) {
    // Don't crash: just report missing config
    return res.status(500).json({ error: "Server misconfigured: SECRET missing" });
  }

  const psw = String(req.body.password);

  // Optional: remove password so you don't store it accidentally
  req.body.password = "";

  req.token = createSecurePassToken(psw, secret);
  return next();
}

function createSecurePassToken(psw, secret) {
  return {
    psw: hashPassword(psw, secret),
    token: {}
  };
}

function hashPassword(psw, secret) {
  const hmac = createHmac("sha256", secret);
  hmac.update(psw);
  return hmac.digest("hex");
}

export default securityAudit;
