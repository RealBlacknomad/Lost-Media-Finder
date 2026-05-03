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
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
      );
      const data = await response.json();

      resultsDiv.innerHTML = "";
      let found = false;

      // Mostrar el Abstract principal si existe
      if (data.AbstractText) {
        const div = document.createElement("div");
        div.className = "result-item";
        div.innerHTML = `
          <h2>${data.Heading}</h2>
          <p>${data.AbstractText}</p>
          ${data.AbstractURL ? `<p><a href="${data.AbstractURL}" target="_blank">Más información</a></p>` : ""}
        `;
        resultsDiv.appendChild(div);
        found = true;
      }

      // Mostrar RelatedTopics
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach(item => {
          if (item.Text && item.FirstURL) {
            const div = document.createElement("div");
            div.className = "result-item";
            div.innerHTML = `
              <h3><a href="${item.FirstURL}" target="_blank">${item.Text}</a></h3>
              <p>${item.Text}</p>
            `;
            resultsDiv.appendChild(div);
            found = true;
          }
        });
      }

      if (!found) {
        resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
      }
    } catch (error) {
      resultsDiv.innerHTML = `<p>Error al buscar: ${error.message}</p>`;
    }
  });
});
