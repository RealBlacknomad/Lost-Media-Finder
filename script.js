document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  // 🚫 sitios bloqueados (mainstream)
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

  // 🧠 priorización de contenido "oscuro"
  function score(url) {
    if (url.includes("archive.org")) return 10;
    if (url.includes("blog")) return 8;
    if (url.includes("forum")) return 7;
    if (url.includes("reddit")) return 6;
    return 1;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultsDiv.innerHTML = "<p>Buscando en lo profundo de internet...</p>";

    let query = input.value.trim();
    if (!query) {
      resultsDiv.innerHTML = "<p>Escribe algo primero.</p>";
      return;
    }

    // 🔎 optimización de búsqueda
    query += " lost media obscure rare film archive";

    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&origin=*`
      );

      const data = await response.json();

      let results = [];

      // resultados relacionados
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach(item => {
          if (item.Text && item.FirstURL && !isBlocked(item.FirstURL)) {
            results.push({
              title: item.Text,
              url: item.FirstURL
            });
          }
        });
      }

      // 🧠 ordenar por relevancia "oscura"
      results.sort((a, b) => score(b.url) - score(a.url));

      resultsDiv.innerHTML = "";

      if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No se encontraron resultados interesantes.</p>";
        return;
      }

      // 🖼️ render con imagen
      results.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";

        const image = `https://source.unsplash.com/300x200/?${encodeURIComponent(input.value)}`;

        div.innerHTML = `
          <img src="${image}" style="width:300px; height:200px; object-fit:cover; border-radius:8px;">
          <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
        `;

        resultsDiv.appendChild(div);
      });

    } catch (error) {
      resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});
