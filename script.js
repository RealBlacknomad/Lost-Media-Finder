document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultsDiv.innerHTML = "<p>🔎 Buscando...</p>";

    const query = input.value.trim();

    if (!query) {
      resultsDiv.innerHTML = "<p>Por favor escribe algo.</p>";
      return;
    }

    try {
      const response = await fetch(
        `https://lost-media-finder.onrender.com/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Servidor no responde");
      }

      const data = await response.json();

      resultsDiv.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach((item) => {
          const div = document.createElement("div");
          div.className = "result-item";

          div.innerHTML = `
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
          `;

          resultsDiv.appendChild(div);
        });
      } else {
        resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
      }

    } catch (error) {
      resultsDiv.innerHTML = `
        <p>Error de conexión.</p>
        <p style="color:gray;">Verifica que el backend esté activo.</p>
      `;
      console.error(error);
    }
  });
});
