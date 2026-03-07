import express from "express";
import {listUsers, findUserByUsername , createUser, deleteUserById, updateUsername,} from "../services/userService.mjs";
import { isValidUuid } from "../services/validation.mjs";
import { translate } from "../modules/translator.mjs";

const userRouter = express.Router();
userRouter.use(express.json());


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

userRouter.get("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { id } = req.params;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      error: translate(lang, "validation.invalidUserId"),
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
  const { username, ToSAccepted } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.usernameRequired"),
    });
  }

  if (!req.token?.psw) {
    return res.status(400).json({
      error: translate(lang, "validation.passwordRequired"),
    });
  }

  if (ToSAccepted !== true) {
    return res.status(400).json({
      error: translate(lang, "validation.tosMustBeAccepted"),
    });
  }

  const newUser = await createUser({
    username,
    passwordHash: req.token.psw,
  });

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    tosAcceptedAt: newUser.consent.tosAcceptedAt,
  });
});

userRouter.post("/login", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { username } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.usernameRequired"),
    });
  }

  if (!req.token?.psw) {
    return res.status(400).json({
      error: translate(lang, "validation.passwordRequired"),
    });
  }

  try {
    const found = await findUserByUsername(username);

    if (!found) {
      return res.status(401).json({
        error: translate(lang, "auth.invalidCredentials"),
      });
    }

    if (found.passwordHash !== req.token.psw) {
      return res.status(401).json({
        error: translate(lang, "auth.invalidCredentials"),
      });
    }

    return res.json({
      id: found.id,
      username: found.username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: translate(lang, "errors.databaseError"),
    });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { id } = req.params;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      error: translate(lang, "validation.invalidUserId"),
    });
  }

  try {
    const success = await deleteUserById(id);

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
  const { id } = req.params;
  const { username } = req.body ?? {};

  if (!isValidUuid(id)) {
    return res.status(400).json({
      error: translate(lang, "validation.invalidUserId"),
    });
  }

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.usernameRequired"),
    });
  }

  try {
    const updated = await updateUsername(id, username);

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