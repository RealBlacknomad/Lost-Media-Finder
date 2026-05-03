document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultsDiv.innerHTML = "<p>Buscando...</p>";

    const query = input.value.trim();
    if (!query) {
      resultsDiv.innerHTML = "<p>Por favor ingresa un término.</p>";
      return;
    }

    try {
      const response = await fetch(
        `https://lost-media-finder-production.up.railway.app/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      resultsDiv.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach((item) => {
          const div = document.createElement("div");
          div.className = "result-item";
          div.innerHTML = `
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>${item.snippet}</p>
          `;
          resultsDiv.appendChild(div);
        });
      } else {
        resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
      }
    } catch (error) {
      resultsDiv.innerHTML = `<p>Error al buscar: ${error.message}</p>`;
    }
  });
});
