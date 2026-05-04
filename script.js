document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("searchForm");
    const buttons = document.querySelectorAll(".search-actions button");

    let searchType = "all"; // default

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            searchType = btn.dataset.type;

            if (searchType !== "all") {
                buscar();
            }
        });
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            buscar();
        });
    }

    function buscar() {

        const input = document.getElementById("searchInput");
        const resultDiv = document.getElementById("results");

        if (!input || !resultDiv) return;

        const query = input.value.trim();

        if (!query) {
            resultDiv.innerHTML = "<p>⚠️ Escribe algo para buscar</p>";
            return;
        }

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

        // 🎯 BASE QUERY LIMPIA
        let baseQuery = query;

        // 🎬 MODOS
        if (searchType === "movies") {
            baseQuery += " pelicula";
        }

        if (searchType === "series") {
            baseQuery += " serie";
        }

        // 🔍 MODO DEEP
        if (deepMode) {
            baseQuery += " (archive OR lost media OR rare OR obscure)";
            baseQuery += " (\"2000s\" OR \"90s\" OR \"2010\")";
        }

        // filtros
        let filtros = [];

        if (blogs) filtros.push("(site:blogspot.com OR site:wordpress.com)");
        if (foros) filtros.push("(site:reddit.com OR inurl:forum OR site:4chan.org)");
        if (archivos) filtros.push("(site:archive.org OR site:archive.is)");
        if (oldWeb) filtros.push("(\"last updated\" OR \"guestbook\" OR \"old website\")");
        if (descargas) filtros.push("(download OR dvdrip OR \"vhs rip\" OR megaupload)");

        let filtrosQuery = filtros.length ? `(${filtros.join(" OR ")})` : "";

        let excluirQuery = excluir ? "-netflix -amazon -prime -disney -hbo" : "";

        const finalQuery = `${baseQuery} ${filtrosQuery} ${excluirQuery}`;

        const googleURL = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;

        resultDiv.innerHTML = `
            <h2>🔎 Resultados sugeridos</h2>
            <p><strong>Modo:</strong> ${searchType}</p>
            <p>${finalQuery}</p>
            <br>
            <a href="${googleURL}" target="_blank">👉 Buscar en Google</a>
        `;
    }

});
