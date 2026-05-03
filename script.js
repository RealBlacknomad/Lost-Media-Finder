document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultsDiv.textContent = "Buscando...";

    const query = input.value.trim();
    if (!query) {
      resultsDiv.textContent = "Por favor ingresa un término.";
      return;
    }

    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
      );
      const data = await response.json();

      // Mostrar el JSON crudo incrustado
      resultsDiv.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      resultsDiv.textContent = `Error al buscar: ${error.message}`;
    }
  });
});
