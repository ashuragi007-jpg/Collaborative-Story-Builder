import { api } from "../actions/apiClient.mjs";

const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

const storyTitle = document.querySelector("#story-title");
const storyDescription = document.querySelector("#story-description");
const chaptersContainer = document.querySelector("#chapters-container");

async function loadStory() {
  try {
    const story = await api(`/stories/${storyId}`);

    storyTitle.textContent = story.title;
    storyDescription.textContent = story.description || "No description";
  } catch (err) {
    console.error("Failed to load story:", err);
    storyTitle.textContent = "Story not found";
    storyDescription.textContent = "";
  }
}

async function loadChapters() {
  try {
    const data = await api(`/chapters/byStory/${storyId}`);
    const chapters = data.chapters || [];

    if (chapters.length === 0) {
      chaptersContainer.innerHTML = "<p>No chapters yet.</p>";
      return;
    }

    chaptersContainer.innerHTML = chapters.map((chapter, index) => `
      <article class="reader-chapter">
        <h2>Chapter ${index + 1}</h2>
        <p>${chapter.content}</p>
      </article>
    `).join("");
  } catch (err) {
    console.error("Failed to load chapters:", err);
    chaptersContainer.innerHTML = "<p>Failed to load chapters.</p>";
  }
}

loadStory();
loadChapters();
