import { api } from "../actions/apiClient.mjs";

const params = new URLSearchParams(window.location.search);
const chapterId = params.get("id");

const storyTitle = document.querySelector("#story-title");
const chapterTitle = document.querySelector("#chapter-title");
const chapterContent = document.querySelector("#chapter-content");

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const prevBottom = document.querySelector("#prev-btn-bottom");
const nextBottom = document.querySelector("#next-btn-bottom");
const backBtn = document.querySelector(".back-btn");

async function loadChapterPage() {
  try {
    const chapter = await api(`/chapters/${chapterId}`);
    const storyId = chapter.storyId || chapter.story_id;

    const story = await api(`/stories/${storyId}`);
    storyTitle.textContent = story.title;

    if (backBtn) {
      backBtn.onclick = () => {
        window.location.href = `/pages/readerView.html?id=${storyId}`;
      };
    }

    chapterContent.textContent = chapter.content || "";

    const data = await api(`/chapters/byStory/${storyId}`);
    const chapters = data.chapters || [];

    const currentIndex = chapters.findIndex(ch => ch.id === chapterId);

    chapterTitle.textContent = `Chapter ${currentIndex + 1}`;

    if (currentIndex <= 0) {
      prevBtn.disabled = true;
      if (prevBottom) prevBottom.disabled = true;
    } else {
      prevBtn.disabled = false;
      if (prevBottom) prevBottom.disabled = false;

      const prevHandler = () => {
        window.location.href = `/pages/chapter.html?id=${chapters[currentIndex - 1].id}`;
      };

      prevBtn.onclick = prevHandler;
      if (prevBottom) prevBottom.onclick = prevHandler;
    }

    if (currentIndex === -1 || currentIndex >= chapters.length - 1) {
      nextBtn.disabled = true;
      if (nextBottom) nextBottom.disabled = true;
    } else {
      nextBtn.disabled = false;
      if (nextBottom) nextBottom.disabled = false;

      const nextHandler = () => {
        window.location.href = `/pages/chapter.html?id=${chapters[currentIndex + 1].id}`;
      };

      nextBtn.onclick = nextHandler;
      if (nextBottom) nextBottom.onclick = nextHandler;
    }

  } catch (err) {
    console.error("Failed to load chapter page:", err);
    storyTitle.textContent = "Story not found";
    chapterTitle.textContent = "Chapter not found";
    chapterContent.textContent = "";

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    if (prevBottom) prevBottom.disabled = true;
    if (nextBottom) nextBottom.disabled = true;
  }
}

loadChapterPage();
