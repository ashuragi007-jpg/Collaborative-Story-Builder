import express from "express";
import {
  listUsers,
  createUser,
  deleteUserById,
  updateUsername,
  
} from "../services/userService.mjs";
import { translate } from "../modules/translator.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

/*
userRouter.get("/", async (req, res) => {
  const users = await listUsers();

  res.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      tosAcceptedAt: u.consent.tosAcceptedAt,
    }))
  );
});
*/
userRouter.get("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const id = (req.params.id ?? "").trim();

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return res.status(400).json({
      error: translate(lang, "validation.invalidUserIdFormat"),
    });
  }

  try {
    const found = await findUserById(id);

    if (!found) {
      return res.status(404).json({
        error: translate(lang, "errors.userNotFound"),
      });
    }

    return res.json({
      id: found.id,
      username: found.username,
      tosAcceptedAt: found.consent?.tosAcceptedAt ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: translate(lang, "errors.databaseError"),
    });
  }
});

userRouter.post("/", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { username, password, ToSAccepted } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.usernameRequired"),
    });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.passwordRequired"),
    });
  }

  if (ToSAccepted !== true) {
    return res.status(400).json({
      error: translate(lang, "validation.tosMustBeAccepted"),
    });
  }

  const newUser = await createUser({ username });

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    tosAcceptedAt: newUser.consent.tosAcceptedAt,
  });
});

userRouter.delete("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";

  try {
    const success = await deleteUserById(req.params.id);

    if (!success) {
      return res.status(404).json({
        error: translate(lang, "errors.userNotFound"),
      });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: translate(lang, "errors.databaseError"),
    });
  }
});

userRouter.patch("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { username } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.usernameRequired"),
    });
  }

  try {
    const updated = await updateUsername(req.params.id, username);

    if (!updated) {
      return res.status(404).json({
        error: translate(lang, "errors.userNotFound"),
      });
    }

    return res.json({
      id: updated.id,
      username: updated.username,
      tosAcceptedAt: updated.consent?.tosAcceptedAt ?? null,
    });
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({
        error: translate(lang, "errors.usernameAlreadyTaken"),
      });
    }
    console.error(err);
    return res.status(500).json({
      error: translate(lang, "errors.databaseError"),
    });
  }
});

export default userRouter;