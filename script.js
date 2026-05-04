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

        if (searchType === "blogs") {
            finalQuery += " (blog OR wordpress OR blogspot)";
        }

        // 🔎 FILTROS
        if (document.getElementById("deepMode")?.checked) {
            finalQuery += " (lost media OR rare OR obscure)";
        }

        if (document.getElementById("excludeStreaming")?.checked) {
            finalQuery += " -netflix -amazon -disney -hulu";
        }

        try {
            const API_URL = "https://lost-media-finder.onrender.com/search";

            const res = await fetch(
                `${API_URL}?q=${encodeURIComponent(finalQuery)}&type=${searchType}`
            );

            const text = await res.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Respuesta no es JSON:", text);
                resultDiv.innerHTML = "❌ Error del servidor";
                return;
            }

            if (!data.results || data.results.length === 0) {
                resultDiv.innerHTML = "❌ Sin resultados";
                return;
            }

            resultDiv.innerHTML = "<h2>🔎 Resultados</h2>";

            data.results.forEach(r => {

                let filesHtml = "";

                if (r.files && r.files.length > 0) {

                    filesHtml = "<ul>";

                    r.files.forEach(f => {

                        let icon = "📄";

                        if (f.type === "video") icon = "🎬";
                        else if (f.type === "audio") icon = "🎵";
                        else if (f.type === "image") icon = "🖼️";
                        else if (f.type === "archive") icon = "📦";

                        filesHtml += `
                            <li>
                                ${icon}
                                <a href="${f.url}" target="_blank">${f.url}</a>
                            </li>
                        `;
                    });

                    filesHtml += "</ul>";
                }

                resultDiv.innerHTML += `
                    <div class="result-item">
                        <a href="${r.url}" target="_blank">${r.title}</a>
                        <p>${r.url}</p>
                        ${filesHtml}
                    </div>
                `;
            });

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = "❌ Error conectando con backend";
        }
    }
});
