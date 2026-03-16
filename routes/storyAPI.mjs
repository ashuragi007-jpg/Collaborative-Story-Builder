import express from "express";
import { createStory, listStories, findStoryById, findStoriesByAuthor } from "../services/storyService.mjs";
import { translate } from "../modules/translator.mjs";

const storyRouter = express.Router();

storyRouter.use(express.json());

storyRouter.get("/", async (req, res) => {
  const stories = await listStories();
  res.json({ stories });
});

storyRouter.get("/byAuthor/:authorId", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  try {
    const stories = await findStoriesByAuthor(req.params.authorId);
    res.json({ stories });
  } catch {
    return res.status(400).json({
      error: translate(lang, "errors.storyNotFound")
    });
  }
})

storyRouter.get("/:id", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const story = await findStoryById(req.params.id);

  if (!story) {
    return res.status(404).json({
      error: translate(lang, "errors.storyNotFound")
    });
  }

  res.json(story);
});

storyRouter.post("/", async (req, res) => {
  const lang = req.headers["accept-language"] || "";
  const { title, description, authorId } = req.body ?? {};

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: translate(lang, "validation.titleRequired")
    });
  }

  if (!authorId || typeof authorId !== "string") {
    return res.status(400).json({
      error: translate(lang, "errors.loginRequired")
    });
  }

  const newStory = await createStory({ title, description, authorId });

  res.status(201).json(newStory);
});

export default storyRouter;