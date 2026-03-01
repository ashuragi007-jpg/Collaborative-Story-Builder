import express from "express"
import { listUsers, findUserById, createUser, deleteUserById, updateUsername } from "../services/userService.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", (req, res) => {
  const users = listUsers();

  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    tosAcceptedAt: u.consent.tosAcceptedAt
  })));
});

userRouter.get("/:id", (req, res) => {
  const found = findUserById(req.params.id);

  if (!found) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json({
    id: found.id,
    username: found.username,
    tosAcceptedAt: found.consent.tosAcceptedAt
  });
});

userRouter.post("/", async (req, res) => {
  const { username, password, ToSAccepted } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username required" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "password required" });
  }

  if (ToSAccepted !== true) {
    return res.status(400).json({ error: "ToSAccepted must be true" });
  }

  const newUser = await createUser({ username });

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    tosAcceptedAt: newUser.consent.tosAcceptedAt
  });
});

userRouter.delete("/:id", (req, res) => {
  const success = deleteUserById(req.params.id);

  if (!success) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(204).send();
});

userRouter.patch("/:id", (req, res) => {
  const { username } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username required" });
  }

  const updated = updateUsername(req.params.id, username);

  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({
    id: updated.id,
    username: updated.username,
    tosAcceptedAt: updated.consent.tosAcceptedAt
  });
});

export default userRouter;