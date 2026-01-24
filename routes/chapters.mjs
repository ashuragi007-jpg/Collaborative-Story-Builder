import express from "express";
import validateChapterLength from "../modules/validateChapterLength.mjs";
import sanitizeContent from "../modules/sanitizeContent.mjs";

const chapterRouter= express.Router();


chapterRouter.post("/", sanitizeContent, validateChapterLength, (req, res) => {
    res.json({
        message: req.sanitized
            ? "Chapter accepted, but illegal characters was removed"
            : "Chapter accepted",
       // content: req.body.content, /*-- Shows the content again --*/
    });
});

export default chapterRouter;