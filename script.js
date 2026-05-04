document.getElementById("searchBtn").addEventListener("click", buscar);

function buscar() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!query) {
        resultsDiv.innerHTML = "<p>Escribe algo para buscar 👀</p>";
        return;
    }

    // Obtener filtros
    const blogs = document.getElementById("blogs").checked;
    const foros = document.getElementById("foros").checked;
    const archivos = document.getElementById("archivos").checked;
    const descargas = document.getElementById("descargas").checked;
    const excluir = document.getElementById("excluir").checked;
    const deepMode = document.getElementById("deepMode").checked;

    // 🔵 BASE (modo inteligente)
    let baseQuery = `"${query}"`;

    // Añadir contexto inteligente (tipo Google)
    baseQuery += " pelicula video animacion";

    // 🔴 MODO DEEP (lost media)
    if (deepMode) {
        baseQuery += " (archive OR lost media OR obscure OR rare)";
        baseQuery += " (\"2000\" OR \"2005\" OR \"2010\")";
    }

    // 🎯 Filtros (ahora con OR, no AND)
    let filtros = [];

    if (blogs) {
        filtros.push("(site:blogspot.com OR site:wordpress.com)");
    }

    if (foros) {
        filtros.push("(site:reddit.com OR inurl:forum OR site:4chan.org)");
    }

    if (archivos) {
        filtros.push("(site:archive.org OR site:archive.is)");
    }

    if (descargas) {
        filtros.push("(\"download\" OR \"dvdrip\" OR \"vhs rip\" OR \"megaupload\")");
    }

    // 👉 IMPORTANTE: usar OR entre filtros
    let filtrosQuery = "";
    if (filtros.length > 0) {
        filtrosQuery = "(" + filtros.join(" OR ") + ")";
    }

    // 🚫 Excluir plataformas comerciales
    let excludeQuery = "";
    if (excluir) {
        excludeQuery = "-netflix -amazon -prime -disney -hbo";
    }

    // 🧩 QUERY FINAL
    const finalQuery = `${baseQuery} ${filtrosQuery} ${excludeQuery}`;

    // 🔗 LINKS LIMPIOS (NO mostramos la query)
    const googleURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    const redditURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery + " site:reddit.com")}`;
    const archiveURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery + " site:archive.org")}`;

    // 🎨 OUTPUT LIMPIO
    resultsDiv.innerHTML = `
        <h2>🔎 Resultados sugeridos</h2>

        <div class="result-item">
            <a href="${googleURL}" target="_blank">🌐 Buscar en Google</a>
            <p>Búsqueda general inteligente</p>
        </div>

        <div class="result-item">
            <a href="${redditURL}" target="_blank">💬 Buscar en foros / Reddit</a>
            <p>Discusiones y pistas de usuarios</p>
        </div>

        <div class="result-item">
            <a href="${archiveURL}" target="_blank">📦 Buscar en Archive</a>
            <p>Contenido antiguo y perdido</p>
        </div>
    `;
}