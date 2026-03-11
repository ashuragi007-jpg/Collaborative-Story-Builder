import { api } from "../actions/apiClient.mjs";

const storyTitle = document.querySelector("#story-title");
const storyDescription = document.querySelector("#story-description");
const storyCreated = document.querySelector("#story-created");

const chaptersList = document.querySelector("#chapters-list");

const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

const addChapterBtn = document.querySelector("#add-chapter-btn");
const editorPanel = document.querySelector("#editor-panel");
const editorPlaceholder = document.querySelector("#editor-placeholder");
const chapterContent = document.querySelector("#chapter-content");

let activeChapterId = null;

function showOverview() {
  editorPlaceholder.hidden = false;
  editorPanel.hidden = true;
}

function showEditor() {
  editorPlaceholder.hidden = true;
  editorPanel.hidden = false;
}

addChapterBtn.addEventListener("click", () => {
  activeChapterId = null;
  showEditor();
  chapterContent.value = "";
  chapterContent.focus();
});

async function loadStory() {
  const story = await api(`/stories/${storyId}`);

  storyTitle.textContent = story.title;
  storyDescription.textContent = story.description || "No description";
  storyCreated.textContent = new Date(story.created_at).toLocaleString();
}

async function loadChapters() {
  const data = await api(`/chapters/byStory/${storyId}`);
  const chapters = data.chapters || [];

  if (chapters.length === 0) {
    chaptersList.innerHTML = "<p>No chapters yet.</p>";
    showEditor();
    chapterContent.value = "";
    return;
  }

  showOverview();

  chaptersList.innerHTML = chapters.map((ch, index) => `
  <article
    class="chapter-card"
    data-id="${ch.id}"
    data-content="${encodeURIComponent(ch.content)}"
  >
    <span class="chapter-title">Chapter ${index + 1}</span>
    <span class="chapter-date">${new Date(ch.created_at).toLocaleString()}</span>
  </article>
`).join("");



  const chapterCards = chaptersList.querySelectorAll(".chapter-card");

  chapterCards.forEach(card => {
    card.addEventListener("click", () => {
      activeChapterId = card.dataset.id;
      chapterContent.value = decodeURIComponent(card.dataset.content);
      showEditor();
      chapterContent.focus();
    });
  });
}

loadStory();
loadChapters();
