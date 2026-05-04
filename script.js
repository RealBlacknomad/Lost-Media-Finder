document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("searchForm");
    const buttons = document.querySelectorAll(".search-actions button");

    let searchType = "all";

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            searchType = btn.dataset.type;
            buscar();
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

        // 🎬 TIPOS
        if (searchType === "movies") finalQuery += " pelicula";
        if (searchType === "series") finalQuery += " serie";

        // 📁 INDEX OF (modo bruto)
        if (searchType === "indexof") {
            finalQuery = `intitle:index.of ${query}`;
        }

        // 📝 BLOGS
        if (searchType === "blogs") {
            finalQuery += " (blog OR wordpress OR blogspot)";
        }

        // 🔎 MODO PROFUNDO
        const deepMode = document.getElementById("deepMode");
        if (deepMode && deepMode.checked) {
            finalQuery += " (lost media OR rare OR obscure OR forgotten)";
        }

        // 🔥 FILTROS AVANZADOS
        if (document.getElementById("blogsOnly")?.checked) {
            finalQuery += " site:blogspot.com OR site:wordpress.com";
        }

        if (document.getElementById("forums")?.checked) {
            finalQuery += " (forum OR reddit OR threads)";
        }

        if (document.getElementById("archives")?.checked) {
            finalQuery += " (archive.org OR web.archive.org)";
        }

        if (document.getElementById("oldWeb")?.checked) {
            finalQuery += " (old website OR 2000s OR geocities)";
        }

        if (document.getElementById("downloads")?.checked) {
            finalQuery += " (mp4 OR avi OR mkv OR mp3 OR download)";
        }

        if (document.getElementById("excludeStreaming")?.checked) {
            finalQuery += " -netflix -amazon -disney -hulu";
        }

        try {
            const API_URL = "https://lost-media-finder.onrender.com/search";

            const res = await fetch(
                `${API_URL}?q=${encodeURIComponent(finalQuery)}&type=${searchType}`
            );

            // 🔥 PROTECCIÓN CONTRA HTML (error típico)
            const text = await res.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Respuesta no es JSON:", text);
                resultDiv.innerHTML = "❌ Error del servidor (no JSON)";
                return;
            }

            if (!data.results || data.results.length === 0) {
                resultDiv.innerHTML = "❌ Sin resultados";
                return;
            }

            resultDiv.innerHTML = "<h2>🔎 Resultados</h2>";

            data.results.forEach(r => {
                resultDiv.innerHTML += `
                    <div class="result-item">
                        <a href="${r.url}" target="_blank">${r.title}</a>
                        <p>${r.url}</p>
                    </div>
                `;
            });

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = "❌ Error conectando con backend";
        }
    }
});
