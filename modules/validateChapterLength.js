function validateChapterLength(req, res, next){
    const {content} = req.body;

    if (!content){
        return res.status(400).json({
            message: "Content is required"
        });
    }

    const wordCount = content.trim().split(/\s+/).length;

    if(wordCount < 50){
        return res.status(400).json({
            message: "Chapter must be at least 50 words"
        });
    }

    if(wordCount > 3000){
        return res.status(400).json({
            message: "Chapter must not exceed 3000 words"
        });
    }
    next();
}

export default validateChapterLength;