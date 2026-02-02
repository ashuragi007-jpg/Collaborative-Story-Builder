import express from "express";
import storyRouter from "./routes/storyAPI.mjs";
import chapterRouter from "./routes/chaptersAPI.mjs";
import userRouter from "./routes/userAPI.mjs";
import securityAudit from "./modules/security.mjs";

const app = express()
const port = 3004

app.use(express.json());

app.use("/user", userRouter);
app.use("/stories", storyRouter);
app.use("/chapters", chapterRouter);

app.get('/', (req, res) => {
  res.send('Hello123 World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
