import { api } from "../actions/apiClient.mjs";
 
const createStoryBtn = document.querySelector("#create-story-btn");
const authBtn = document.querySelector("#auth-btn");
const storiesList = document.querySelector("#stories-list");

createStoryBtn.addEventListener("click", () => {
  window.location.href = "/pages/create-story.html";
});

function updateAuthButton() {
  const currentUserId = localStorage.getItem("currentUserId");
  authBtn.textContent = currentUserId ? "Account" : "Login";
}

authBtn.addEventListener("click", () => {
  window.location.href = "/pages/login.html";
});

function renderStories(stories) {
  if (!stories.length) {
    storiesList.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  storiesList.innerHTML = stories.map(story => `
    <div class="story-row" data-id="${story.id}">
      <span class="story-thumb">
        <img src="/img/book thumb black.png" alt="thumbnail">
      </span>
      <span class="story-row-title">${story.title}</span>
    </div>
  `).join("");
}

storiesList.addEventListener("click", (e) => {
  const row = e.target.closest(".story-row");
  if (!row) return;

  const id = row.dataset.id;
  window.location.href = `/pages/readerView.html?id=${id}`;
});

async function loadStories() {
  try {
    const data = await api("/stories");
    const stories = data.stories || data;
    renderStories(stories);
  } catch (err) {
    console.error("Failed to load stories", err);
  }
}

updateAuthButton();
loadStories();
