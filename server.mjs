import express from "express";
import chapterRouter from "./routes/chapters.mjs";

const app = express()
const port = 3004

app.use(express.json());

app.use("/chapters", chapterRouter);

app.get('/', (req, res) => {
  res.send('Hello123 World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
