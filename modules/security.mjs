import { createHmac } from "node:crypto";

function securityAudit(req, res, next) {
  if (req.method === "POST" && req.body.password) {
    req.token = createSecurePassToken(req.body.password, process.env.SECRET);
  }

  next();
}

function createSecurePassToken(psw, secret) {
  return {
    psw: hashPassword(psw, secret),
    token: {}
  };
}

function hashPassword(psw, secret) {
  if (!secret) {
    throw new Error("SECRET environment variable is not defined");
  }

  const hmac = createHmac("sha256", secret);
  hmac.update(psw);
  return hmac.digest("hex");
}

export default securityAudit;