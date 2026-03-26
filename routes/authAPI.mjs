import express from "express";
import { translate } from "../modules/translator.mjs";
import { findUserByUsername } from "../services/userService.mjs";
import { updatePassword } from "../services/userService.mjs";

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post("/login", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  const user = await findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ error: translate(lang, "auth.invalidCredentials") });
  }

  if (!user || user.passwordHash !== req.token?.psw) {
    return res.status(401).json({ error: translate(lang, "auth.invalidCredentials") });
  }

  res.json({
    id: user.id,
    username: user.username
  });
});

authRouter.patch("/users/:id/password", async (req, res) => {
  const { id } = req.params;

  if (!req.token?.psw) {
    return res.status(400).json({ error: "password required" });
  }

  const updated = await updatePassword(id, req.token.psw);

  if (!updated) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json(updated);
});

export default authRouter;