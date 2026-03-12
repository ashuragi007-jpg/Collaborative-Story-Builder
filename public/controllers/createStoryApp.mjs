import { api } from "../actions/apiClient.mjs";

const form = document.querySelector("#create-story-form");
const errorEl = document.querySelector("#story-form-error");

console.log("createStoryApp loaded");
console.log("form found:", form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const title = data.get("title");
  const description = data.get("description");
  const authorId = localStorage.getItem("currentUserId");

  try {
    errorEl.hidden = true;

    const story = await api("/stories", {
      method: "POST",
      body: { title, description, authorId }
    });   

    window.location.href = `/pages/editor.html?id=${story.id}`;
  } catch (err) {
    console.error("create story failed:", err);
    errorEl.textContent = err.message || "Failed to create story";
    errorEl.hidden = false;
  }
});