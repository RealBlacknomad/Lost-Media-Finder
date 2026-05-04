document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("button");
    if (btn) {
        btn.addEventListener("click", buscar);
    }
});

function buscar() {
    const input = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    if (!input || !resultsDiv) return;

    const query = input.value.trim();

    if (!query) {
        resultsDiv.innerHTML = "<p>Escribe algo para buscar 👀</p>";
        return;
    }

    // Leer checkboxes (adaptado a tu HTML)
    const getChecked = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    const blogs = getChecked("blogsOnly");
    const foros = getChecked("forums");
    const archivos = getChecked("archives");
    const oldWeb = getChecked("oldWeb");
    const descargas = getChecked("downloads");
    const excluir = getChecked("excludeStreaming");
    const deepMode = getChecked("deepMode");

    let baseQuery = `"${query}" pelicula video animacion`;

    if (deepMode) {
        baseQuery += " (archive OR lost media OR rare OR obscure)";
        baseQuery += " (\"2000\" OR \"2005\" OR \"2010\")";
    }

    let filtros = [];

    if (blogs) filtros.push("(site:blogspot.com OR site:wordpress.com)");
    if (foros) filtros.push("(site:reddit.com OR inurl:forum OR site:4chan.org)");
    if (archivos) filtros.push("(site:archive.org OR site:archive.is)");
    if (oldWeb) filtros.push("(\"last updated\" OR \"guestbook\" OR \"old website\")");
    if (descargas) filtros.push("(download OR dvdrip OR \"vhs rip\" OR megaupload)");

    let filtrosQuery = filtros.length ? "(" + filtros.join(" OR ") + ")" : "";

    let excludeQuery = excluir ? "-netflix -amazon -prime -disney -hbo" : "";

    const finalQuery = `${baseQuery} ${filtrosQuery} ${excludeQuery}`;

    const googleURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    const redditURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery + " site:reddit.com")}`;
    const archiveURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery + " site:archive.org")}`;

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
