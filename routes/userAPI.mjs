import express from "express"
import { createUser, deleteUserById, updateUsername } from "../services/userService.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

/*
userRouter.get("/", async (req, res) => {
  const users = await listUsers();

  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    tosAcceptedAt: u.consent.tosAcceptedAt
  })));
});
*/
userRouter.get("/:id", async (req, res) => {
  try {
    const found = await findUserById(req.params.id);

    if (!found) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({
      id: found.id,
      username: found.username,
      tosAcceptedAt: found.consent?.tosAcceptedAt ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "database error" });
  }
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

userRouter.delete("/:id", async (req, res) => {
  try {
    const success = await deleteUserById(req.params.id);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "database error" });
  }
});

userRouter.patch("/:id", async (req, res) => {
  const { username } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username required" });
  }

  try {
    const updated = await updateUsername(req.params.id, username);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: updated.id,
      username: updated.username,
      tosAcceptedAt: updated.consent?.tosAcceptedAt ?? null,
    });
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "username already taken" });
    }
    console.error(err);
    return res.status(500).json({ error: "database error" });
  }
});;

export default userRouter;