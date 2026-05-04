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

        // 📝 BLOGS
        if (searchType === "blogs") {
            finalQuery += " (blog OR wordpress OR blogspot)";
        }

        // 🔎 MODO PROFUNDO
        if (document.getElementById("deepMode")?.checked) {
            finalQuery += " (lost media OR rare OR obscure OR forgotten)";
        }

        // 🔥 FILTROS
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
                    filesHtml = "<ul class='file-list'>";

                    r.files.forEach(f => {

                        let icon = "📄";

                        // ✅ USAR f.type (CORRECTO)
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
                        ${filesHtml}
                    </div>
                `;
            });

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = "❌ Error de conexión";
        }
    }

});
