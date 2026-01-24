function sanitizeContent(req, res, next) {
  const { content } = req.body;

  if (!content) return next();

  const scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  const tagRegex = /<[^>]+>/g;

  const scriptTexts = scriptRegex.test(content);
  const tagTexts = tagRegex.test(content);

  req.body.content = content
    .replace(scriptRegex, "")
    .replace(tagRegex, "");

  req.sanitized = scriptTexts || tagTexts;

  next();
}

export default sanitizeContent;
