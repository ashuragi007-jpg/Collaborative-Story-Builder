import express from "express";
import "dotenv/config";
import { pool } from "./db.mjs";
import storyRouter from "./routes/storyAPI.mjs";
import chapterRouter from "./routes/chaptersAPI.mjs";
import userRouter from "./routes/userAPI.mjs";
import securityAudit from "./modules/security.mjs";

const app = express()
const port = process.env.PORT || 3004;

app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/stories", storyRouter);
app.use("/chapters", chapterRouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
