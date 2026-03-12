import { api } from "../actions/apiClient.mjs";

const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

const storyTitle = document.querySelector("#story-title");
const storyDescription = document.querySelector("#story-description");
const chaptersContainer = document.querySelector("#chapters-container");
const storyAuthor = document.querySelector("#story-author");
const storyCreated = document.querySelector("#story-created");

async function loadStory() {
  try {
    const story = await api(`/stories/${storyId}`);

    storyTitle.textContent = story.title;
    storyDescription.textContent = story.description || "No description";
    storyAuthor.textContent = story.author || "Unknown author";
    storyCreated.textContent = new Date(story.created_at).toLocaleString();
  } catch (err) {
    console.error("Failed to load story:", err);
    storyTitle.textContent = "Story not found";
    storyDescription.textContent = "";
    storyAuthor.textContent = "";
    storyCreated.textContent = "";
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
      <div class="reader-chapter" data-id="${chapter.id}">
        Chapter ${index + 1}
      </div>
    `).join("");

    const chapterItems = chaptersContainer.querySelectorAll(".reader-chapter");

    chapterItems.forEach(item => {
      item.addEventListener("click", () => {
        const chapterId = item.dataset.id;
        window.location.href = `/pages/chapter.html?id=${chapterId}`;
      });
    });

  } catch (err) {
    console.error("Failed to load chapters:", err);
    chaptersContainer.innerHTML = "<p>Failed to load chapters.</p>";
  }
}

loadStory();
loadChapters();
