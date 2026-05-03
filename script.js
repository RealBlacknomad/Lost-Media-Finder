const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultsDiv.innerHTML = "<p>Buscando...</p>";
  const query = document.getElementById('query').value;

  try {
    const response = await fetch("https://lost-media-finder.onrender.com/search?q=" + encodeURIComponent(query));
    if (!response.ok) {
      throw new Error("Respuesta no válida del servidor");
    }
    const data = await response.json();

    resultsDiv.innerHTML = "";
    if (data.results && data.results.length > 0) {
      data.results.forEach(r => {
        const div = document.createElement('div');
        div.className = "result";
        div.innerHTML = `<a href="${r.url}" target="_blank">${r.title}</a><p>${r.snippet}</p>`;
        resultsDiv.appendChild(div);
      });
    } else {
      resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
    }
  } catch (err) {
    resultsDiv.innerHTML = "<p>Error al buscar. Intenta de nuevo.</p>";
    console.error("Error en la búsqueda:", err);
  }
});
