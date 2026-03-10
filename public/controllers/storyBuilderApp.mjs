const createStoryBtn = document.querySelector("#create-story-btn");
const createStorySection = document.querySelector("#create-story-section");

createStoryBtn.addEventListener("click", ()=> {
    createStorySection.hidden = !createStorySection.hidden;
});