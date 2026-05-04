document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  // 🚫 sitios bloqueados
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

  // 🧠 búsqueda con fallback
  async function fetchResults(query) {
    const urls = [
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&origin=*`,
      `https://api.allorigins.win/raw?url=https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    ];

    for (let url of urls) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
      } catch (e) {
        console.log("Intento fallido:", url);
      }
    }

    return null;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultsDiv.innerHTML = "<p>🔎 Buscando en lo profundo de internet...</p>";

    let query = input.value.trim();
    if (!query) {
      resultsDiv.innerHTML = "<p>Escribe algo primero.</p>";
      return;
    }

    // 🔥 optimización de búsqueda
    query += " lost media obscure archive forum";

    const data = await fetchResults(query);

    if (!data) {
      resultsDiv.innerHTML = `
        <p>Error de conexión.</p>
        <p style="color:gray;">Intenta otra vez en unos segundos.</p>
      `;
      return;
    }

    let results = [];

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

    resultsDiv.innerHTML = "";

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No se encontraron resultados interesantes.</p>";
      return;
    }

    results.slice(0, 10).forEach(item => {
      const div = document.createElement("div");
      div.className = "result-item";

      const image = `https://source.unsplash.com/300x200/?${encodeURIComponent(input.value)}`;

      div.innerHTML = `
        <img src="${image}">
        <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
      `;

      resultsDiv.appendChild(div);
    });
  });
});
