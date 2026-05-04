async function searchMedia() {
    let query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!query) {
        resultsDiv.innerHTML = "Escribe algo para buscar 👀";
        return;
    }

    resultsDiv.innerHTML = "Buscando...";

    // 🔍 Filtros
    const blogsOnly = document.getElementById("blogsOnly").checked;
    const forums = document.getElementById("forums").checked;
    const archives = document.getElementById("archives").checked;
    const oldWeb = document.getElementById("oldWeb").checked;
    const downloads = document.getElementById("downloads").checked;
    const excludeStreaming = document.getElementById("excludeStreaming").checked;

    let filters = [];

    // 🧠 Construcción inteligente de filtros

    if (blogsOnly) {
        filters.push("(site:blogspot.com OR site:wordpress.com)");
    }

    if (forums) {
        filters.push("(site:reddit.com OR inurl:forum OR site:4chan.org)");
    }

    if (archives) {
        filters.push("(site:archive.org OR site:archive.is)");
    }

    if (oldWeb) {
        filters.push('("guestbook" OR "last updated" OR "2003" OR "2005")');
    }

    if (downloads) {
        filters.push('("download avi" OR "dvdrip" OR "vhs rip" OR "megaupload")');
    }

    if (excludeStreaming) {
        filters.push("-netflix -amazon -prime -disney -hbo");
    }

    // 🔥 Construimos query final
    let finalQuery = query;

    if (filters.length > 0) {
        finalQuery += " " + filters.join(" ");
    }

    console.log("QUERY FINAL:", finalQuery);

    try {
        const response = await fetch(`https://lost-media-finder.onrender.com/search?q=${encodeURIComponent(finalQuery)}`);
        const data = await response.json();

        let results = data.results;

        // 🔥 FIX por si viene como string
        if (typeof results === "string") {
            results = JSON.parse(results);
        }

        resultsDiv.innerHTML = "";

        if (!results || results.length === 0) {
            resultsDiv.innerHTML = "No se encontraron resultados 😢";
            return;
        }

        results.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-item";

            div.innerHTML = `
                <a href="${item.url}" target="_blank">
                    <h3>${item.title}</h3>
                </a>
                <p>${item.url}</p>
            `;

            resultsDiv.appendChild(div);
        });

    } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "Error al buscar 😢";
    }
}