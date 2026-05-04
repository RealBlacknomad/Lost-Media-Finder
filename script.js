async function searchMedia() {
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "Buscando...";

    try {
        const response = await fetch(`https://lost-media-finder.onrender.com/search?q=${query}`);
        const data = await response.json();

        console.log("DATA:", data);

        let results = data.results;

        // 🔥 FIX IMPORTANTE
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
            `;

            resultsDiv.appendChild(div);
        });

    } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "Error al buscar 😢";
    }
}
