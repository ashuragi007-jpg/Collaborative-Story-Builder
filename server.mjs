import express from "express";
import "dotenv/config";
import { pool } from "./db.mjs";
import storyRouter from "./routes/storyAPI.mjs";
import chapterRouter from "./routes/chaptersAPI.mjs";
import userRouter from "./routes/userAPI.mjs";
import authRouter from "./routes/authAPI.mjs";
import securityAudit from "./modules/security.mjs";

const app = express()
const port = process.env.PORT || 3004;

app.use(express.json());
app.use(express.static("public"));

app.use("/users", securityAudit, userRouter);
app.use("/auth", securityAudit, authRouter);
app.use("/stories", storyRouter);
app.use("/chapters", chapterRouter);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
