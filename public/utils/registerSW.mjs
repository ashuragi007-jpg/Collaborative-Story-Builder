if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service worker registered");
    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  });
}
