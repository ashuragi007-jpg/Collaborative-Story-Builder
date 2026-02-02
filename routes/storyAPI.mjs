import express from "express";
import crypto from "node:crypto";
import { stories } from "../dataStores/storiesStore.mjs";

const storyRouter = express.Router();

storyRouter.use(express.json());


storyRouter.get("/", (req, res) => {
    res.json({ stories })
});

storyRouter.get("/:id", (req, res) => {
    const story = stories.find(s => s.id === req.params.id);

    if(!story){
        return res.status(404).json({ error: "Story not found"});
    }

    res.json(story);
})


storyRouter.post("/", (req, res) => {
  const { title, description } = req.body ?? {};

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title required" });
  }

  const newStory = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description || "",
    createdAt: new Date().toISOString()
  };

  stories.push(newStory);

  res.status(201).json(newStory);
});

export default storyRouter;