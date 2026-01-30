import express from "express";
import chapterRouter from "./routes/chapters.mjs";
import userRouter from "./routes/userAPI.mjs";
import securityAudit from "./modules/security.mjs";

const app = express()
const port = 3004

app.use(express.json());

app.use((req, res, next) => {
  console.log("A) incoming", req.method, req.url);
  next();
});

app.use("/user", (req, res, next) => {
  console.log("B) entered /user mount");
  next();
}, securityAudit, (req, res, next) => {
  console.log("C) after securityAudit");
  next();
}, userRouter);

app.use("/chapters", chapterRouter);

app.get('/', (req, res) => {
  res.send('Hello123 World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

app.use((err, req, res, next) => {
  console.error("💥 ERROR STACK:\n", err?.stack || err);
  res.status(500).json({ error: err?.message || "Server error" });
});
