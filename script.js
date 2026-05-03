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

      // Mostrar el JSON completo en pantalla para depuración
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      resultsDiv.innerHTML = `<p>Error al buscar: ${error.message}</p>`;
    }
  });
});
