document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("searchForm");
    const buttons = document.querySelectorAll(".search-actions button");

    let searchType = "all";

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            searchType = btn.dataset.type;
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        buscar();
    });

    async function buscar() {

        const input = document.getElementById("searchInput");
        const resultDiv = document.getElementById("results");

        const query = input.value.trim();

        if (!query) {
            resultDiv.innerHTML = "⚠️ Escribe algo";
            return;
        }

        resultDiv.innerHTML = "⏳ Buscando...";

        let finalQuery = query;

        if (searchType === "movies") finalQuery += " pelicula";
        if (searchType === "series") finalQuery += " serie";
        if (searchType === "blogs") finalQuery += " (blog OR wordpress OR blogspot)";

        try {
            const res = await fetch(
                `https://lost-media-finder.onrender.com/search?q=${encodeURIComponent(finalQuery)}&type=${searchType}`
            );

            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                resultDiv.innerHTML = "❌ Sin resultados";
                return;
            }

            resultDiv.innerHTML = "<h2>🔎 Resultados</h2>";

            data.results.forEach(r => {
                resultDiv.innerHTML += `
                    <div class="result-item">
                        <a href="${r.url}" target="_blank">${r.title}</a>
                    </div>
                `;
            });

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = "❌ Error";
        }
    }

});
