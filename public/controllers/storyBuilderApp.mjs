import { api } from "../actions/apiClient.mjs";
 
const createStoryBtn = document.querySelector("#create-story-btn");
const createStorySection = document.querySelector("#create-story-section");

const storiesList = document.querySelector("#stories-list");

createStoryBtn.addEventListener("click", ()=> {
    window.location.href = "/pages/create-story.html";
});

function renderStories(stories) {

  if (!stories.length) {
    storiesList.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  storiesList.innerHTML = stories.map(story => `
    <div class="story-card" data-id="${story.id}">
      <img src="/img/thanos.webp" alt="Story cover">
      <h3>${story.title}</h3>
    </div>
  `).join("");

  const cards = document.querySelectorAll(".story-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `/pages/readerView.html?id=${id}`;
    });
  });
}

async function loadStories() {
    try {
        const data = await api("/stories");
        const stories = data.stories || data;

        renderStories(stories);
    } catch (err) {
        console.error("Failed to load Stories");
    }
    
}

loadStories();