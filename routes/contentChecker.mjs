import express from "express";
import validateChapterLength from "../modules/validateChapterLength.mjs";

const chapterRouter= express.Router();


chapterRouter.post("/", validateChapterLength, (req, res) => {
    res.json({
        message: "Chapter accepted",
       // content: req.body.content,
    });
});

export default chapterRouter;