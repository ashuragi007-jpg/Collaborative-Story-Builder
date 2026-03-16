const backBtn = document.querySelector(".back-btn");

if (backBtn) {
    backBtn.addEventListener("click", ()=> {
        const target = backBtn.dataset.target || "/";
        window.location.href = target;
    })
}