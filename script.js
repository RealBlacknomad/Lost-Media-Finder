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

      function renderItem(text, url) {
        const div = document.createElement("div");
        div.className = "result-item";
        div.innerHTML = `
          <h3><a href="${url}" target="_blank">${text}</a></h3>
          <p>${text}</p>
        `;
        resultsDiv.appendChild(div);
      }

      // Recorrer RelatedTopics y subtopics
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.forEach(item => {
          if (item.Text && item.FirstURL) {
            renderItem(item.Text, item.FirstURL);
            found = true;
          }
          if (item.Topics) {
            item.Topics.forEach(sub => {
              if (sub.Text && sub.FirstURL) {
                renderItem(sub.Text, sub.FirstURL);
                found = true;
              }
            });
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
