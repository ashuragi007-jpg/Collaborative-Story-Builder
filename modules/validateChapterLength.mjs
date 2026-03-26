import { translate } from "./translator.mjs";

function validateChapterLength(req, res, next){
    const lang = req.headers["accept-language"] || "";
    const {content} = req.body;

    if (!content){
        return res.status(400).json({
            message: translate(lang, "validation.contentRequired")
        });
    }

    const wordCount = content.trim().split(/\s+/).length;

    if (wordCount < 50) {
        return res.status(400).json({
             error: translate(lang, "validation.chapterTooShort")
        });
    }

    if (wordCount > 3000) {
        return res.status(400).json({
            error: translate(lang, "validation.chapterTooLong")
        });
    }

    next();
}

export default validateChapterLength;