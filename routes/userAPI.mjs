import express from "express"
import user from "../dataObjects/user.mjs";
import { generateID } from "../dataObjects/user.mjs";
import { users } from "../dataStores/usersStore.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/", (req, res) => {
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    tosAcceptedAt: u.consent.tosAcceptedAt
  })));
});

userRouter.post("/", (req, res, next) => {
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

    let newUser = user();
    newUser.id = generateID();
    newUser.username = username;
    newUser.consent.tosAcceptedAt = new Date().toISOString();

    users.push(newUser);
    

    return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    tosAcceptedAt: newUser.consent.tosAcceptedAt
  });

  

});

export default userRouter;