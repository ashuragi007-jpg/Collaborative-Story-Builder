import express from "express";
import validateChapterLength from "./modules/validateChapterLength.mjs";

const app = express()
const port = 3001

app.use(express.json());

app.post("/api/chapters", validateChapterLength, (req, res) =>{
  res.json({
    message:"Chapter accepted"
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
