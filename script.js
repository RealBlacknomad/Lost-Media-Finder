document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  const blockedSites = [
    "netflix.com",
    "amazon.com",
    "disneyplus.com",
    "hbo.com",
    "primevideo.com"
  ];

  function isBlocked(url) {
    return blockedSites.some(site => url.includes(site));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultsDiv.innerHTML = "<p>Buscando en la web profunda...</p>";

    let query = input.value.trim();
    if (!query) {
      resultsDiv.innerHTML = "<p>Escribe algo.</p>";
      return;
    }

    query += " lost media obscure archive";

    try {
      const response = await fetch(
        `https://corsproxy.io/?https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      );

      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const links = doc.querySelectorAll(".result__a");

      resultsDiv.innerHTML = "";

      let count = 0;

      links.forEach(link => {
        const url = link.href;
        const title = link.textContent;

        if (!isBlocked(url) && count < 10) {
          const div = document.createElement("div");
          div.className = "result-item";

          const image = `https://source.unsplash.com/300x200/?${encodeURIComponent(input.value)}`;

          div.innerHTML = `
            <img src="${image}" style="width:300px; height:200px; object-fit:cover;">
            <h3><a href="${url}" target="_blank">${title}</a></h3>
          `;

          resultsDiv.appendChild(div);
          count++;
        }
      });

      if (count === 0) {
        resultsDiv.innerHTML = "<p>No se encontraron resultados útiles.</p>";
      }

    } catch (error) {
      resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});
