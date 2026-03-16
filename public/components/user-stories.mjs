import { api } from "../actions/apiClient.mjs";
import { userState } from "../state/userState.mjs";

class UserStories extends HTMLElement {
  connectedCallback() {
    this.container = document.createElement("div");
    this.appendChild(this.container);

    document.addEventListener("session:changed", () => this.loadStories());
    this.loadStories();
  }

  async loadStories() {
    const authorId = userState.currentUserId;

    if (!authorId) {
      this.container.innerHTML = "";
      return;
    }

    try {
      const data = await api(`/stories/byAuthor/${authorId}`);
      const stories = data.stories || [];

      if (!stories.length) {
        this.container.innerHTML = "<p>No stories yet.</p>";
        return;
      }

      this.container.innerHTML = stories.map(story => `
        <div class="my-story" data-id="${story.id}">
          ${story.title}
        </div>
      `).join("");

      const items = this.container.querySelectorAll(".my-story");

      items.forEach(item => {
        item.addEventListener("click", () => {
          const storyId = item.dataset.id;
          window.location.href = `/pages/editor.html?id=${storyId}`;
        });
      });
    } catch (err) {
      console.error("Failed to load stories", err);
      this.container.innerHTML = "<p>Failed to load stories.</p>";
    }
  }
}

customElements.define("user-stories", UserStories);
