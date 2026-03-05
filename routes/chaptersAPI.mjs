import express from "express";
import crypto from "node:crypto";
import validateChapterLength from "../modules/validateChapterLength.mjs";
import sanitizeContent from "../modules/sanitizeContent.mjs";
import { chapters } from "../dataStores/chaptersStore.mjs";
import { translate } from "../modules/translator.mjs";

const chapterRouter = express.Router();

chapterRouter.use(express.json());

chapterRouter.get("/", (req, res) => {
  res.json({ chapters });
});

chapterRouter.get("/byStory/:storyId", (req, res) => {
  const filtered = chapters.filter((c) => c.storyId === req.params.storyId);
  res.json({ chapters: filtered });
});

chapterRouter.get("/:id", (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const chapter = chapters.find((c) => c.id === req.params.id);

  if (!chapter) {
    return res.status(404).json({
      error: translate(lang, "errors.chapterNotFound"),
    });
  }

  res.json(chapter);
});

chapterRouter.post("/", sanitizeContent, validateChapterLength, (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { storyId, content } = req.body ?? {};

  if (!storyId || typeof storyId !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.storyIdRequired"),
    });
  }

  if (!content || typeof content !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.contentRequired"),
    });
  }

  const newChapter = {
    id: crypto.randomUUID(),
    storyId,
    content,
    createdAt: new Date().toISOString(),
  };

  chapters.push(newChapter);

  res.json({
    message: req.sanitized
      ? translate(lang, "success.chapterAcceptedSanitized")
      : translate(lang, "success.chapterAccepted"),
    chapter: {
      id: newChapter.id,
      storyId: newChapter.storyId,
      createdAt: newChapter.createdAt,
    },
  });
});

export default chapterRouter;