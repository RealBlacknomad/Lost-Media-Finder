async function searchMedia(query) {
  try {
    const response = await fetch(
      "https://lost-media-finder-production.up.railway.app/search?q=" + encodeURIComponent(query)
    );
    const data = await response.json();

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach(result => {
        const item = document.createElement("div");
        item.classList.add("result-item");

        const title = document.createElement("h3");
        title.textContent = result.title;

        const link = document.createElement("a");
        link.href = result.url;
        link.textContent = result