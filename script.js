document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("searchForm");
    let searchType = "all";

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

        try {
            const res = await fetch(
                `https://lost-media-finder.onrender.com/search?q=${encodeURIComponent(query)}`
            );

            const data = await res.json();

            resultDiv.innerHTML = "<h2>Resultados</h2>";

            data.results.forEach(r => {
                resultDiv.innerHTML += `
                    <div>
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
