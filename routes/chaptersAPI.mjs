import express from "express";
import validateChapterLength from "../modules/validateChapterLength.mjs";
import sanitizeContent from "../modules/sanitizeContent.mjs";
import { listChapters, listChaptersByStoryId, findChapterById, createChapter, updateChapter } from "../services/chapterService.mjs";
import { translate } from "../modules/translator.mjs";

const chapterRouter = express.Router();

chapterRouter.use(express.json());

chapterRouter.get("/", async (req, res) => {
  const chapters = await listChapters();
  res.json({ chapters });
});

chapterRouter.get("/byStory/:storyId", async (req, res) => {
  const chapters = await listChaptersByStoryId(req.params.storyId);
  res.json({ chapters });
});

chapterRouter.get("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const chapter = await findChapterById(req.params.id);

  if (!chapter) {
    return res.status(404).json({
      error: translate(lang, "errors.chapterNotFound"),
    });
  }

  res.json(chapter);
});

chapterRouter.post("/", sanitizeContent, validateChapterLength, async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { storyId, content, authorId } = req.body ?? {};

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

  if (!authorId || typeof authorId !== "string") {
    return res.status(401).json({
      error: translate(lang, "errors.loginRequired")
    });
  }

  const newChapter = await createChapter({
    storyId,
    content,
    authorId
  });

  res.json({
    message: req.sanitized
      ? translate(lang, "success.chapterAcceptedSanitized")
      : translate(lang, "success.chapterAccepted"),
    chapter: {
      id: newChapter.id,
      storyId: newChapter.story_id,
      createdAt: newChapter.created_at,
    },
  });
});

chapterRouter.patch("/:id", sanitizeContent, validateChapterLength, async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { content,authorId } = req.body ?? {};

   if (!authorId || typeof authorId !== "string") {
    return res.status(401).json({
      error: translate(lang, "errors.loginRequired")
    });
  }
  
  if (!content || typeof content !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.contentRequired"),
    });
  }

  try {
    const updated = await updateChapter(req.params.id, content);

    if (!updated) {
      return res.status(404).json({
        error: translate(lang, "errors.chapterNotFound"),
      });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: translate(lang, "errors.databaseError"),
    });
  }
});


export default chapterRouter;