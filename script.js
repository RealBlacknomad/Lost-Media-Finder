async function buscar() {

    const input = document.getElementById("searchInput");
    const resultDiv = document.getElementById("results");

    const searchType =
        document.querySelector(".search-type:checked")?.value || "all";

    const query = input.value.trim();

    if (!query) {
        resultDiv.innerHTML = "⚠️ Escribe algo";
        return;
    }

    // 🚨 VALIDAR MOTORES
    const selectedEngines = Array.from(document.querySelectorAll(".engine:checked"))
        .map(e => e.value);

    if (selectedEngines.length === 0) {
        resultDiv.innerHTML = "⚠️ Selecciona al menos un motor de búsqueda";
        return;
    }

    resultDiv.innerHTML = "⏳ Buscando...";

    let finalQuery = query;

    // 🔎 FILTROS
    if (document.getElementById("deepMode")?.checked) {
        finalQuery += " (lost media OR rare OR obscure)";
    }

    if (document.getElementById("excludeStreaming")?.checked) {
        finalQuery += " -netflix -amazon -disney -hulu";
    }

    try {
        const API_URL = "https://lost-media-finder.onrender.com/search";

        const url = `${API_URL}?q=${encodeURIComponent(finalQuery)}&type=${searchType}&engines=${selectedEngines.join(",")}`;

        console.log("🚀 Request:", url);

        const res = await fetch(url);

        // 🔥 VALIDAR RESPUESTA HTTP
        if (!res.ok) {
            const errorText = await res.text();
            console.error("HTTP ERROR:", res.status, errorText);
            resultDiv.innerHTML = `❌ Error ${res.status}`;
            return;
        }

        // 🔥 PARSE DIRECTO
        let data = await res.json();

        if (!data.results || data.results.length === 0) {
            resultDiv.innerHTML = "❌ Sin resultados";
            return;
        }

        // ✅ RENDER
        let html = "<h2>🔎 Resultados</h2>";

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

            html += `
                <div class="result-item">
                    <a href="${r.url}" target="_blank">${r.title}</a>
                    <p>${r.url}</p>
                    ${filesHtml}
                </div>
            `;
        });

        resultDiv.innerHTML = html;

    } catch (error) {
        console.error("ERROR GENERAL:", error);
        resultDiv.innerHTML = "❌ Error conectando con backend";
    }
}


// 🚀 CONECTAR FORMULARIO (CLAVE)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        buscar();
    });
});
