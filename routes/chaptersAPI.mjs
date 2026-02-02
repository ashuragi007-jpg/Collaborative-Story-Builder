import express from "express";
import crypto from "node:crypto";
import validateChapterLength from "../modules/validateChapterLength.mjs";
import sanitizeContent from "../modules/sanitizeContent.mjs";
import { chapters } from "../dataStores/chaptersStore.mjs";

const chapterRouter= express.Router();

chapterRouter.use(express.json());

chapterRouter.get("/", (req, res)=>{
    res.json({ chapters });
});

chapterRouter.get("/byStory/:storyId", (req, res) => {
     const filtered = chapters.filter(c => c.storyId === req.params.storyId);
     res.json({ chapters: filtered });
});

chapterRouter.get("/:id", (req, res) => {
  const chapter = chapters.find(c => c.id === req.params.id);
  if (!chapter) return res.status(404).json({ error: "chapter not found" });
  res.json(chapter);
});

chapterRouter.post("/", sanitizeContent, validateChapterLength, (req, res) => {

 const { storyId, content } = req.body ?? {};

  if (!storyId || typeof storyId !== "string") {
    return res.status(400).json({ error: "storyId required" });
  }

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "content required" });
  }

  const newChapter = {
    id: crypto.randomUUID(),
    storyId, 
    content,
    createdAt: new Date().toISOString()
  };

  chapters.push(newChapter);
    res.json({
        message: req.sanitized
            ? "Chapter accepted, but illegal characters was removed"
            : "Chapter accepted",
        chapter: {
            id: newChapter.id,
            storyId: newChapter.storyId,
            createdAt: newChapter.createdAt
    }

    });
});



export default chapterRouter;