from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # habilita CORS para todas las rutas

@app.route("/")
def home():
    return jsonify({"mensaje": "API Lost Media Finder activa"})

@app.route("/search")
def search():
    query = request.args.get("q", "")

    # Resultados simulados (mock). En el paso 2 conectaremos un motor real.
    raw_results = [
        {"title": "Película perdida en foro", "url": "https://foros.com/pelicula", "snippet": "Discusión sobre película perdida"},
        {"title": "IMDb ficha", "url": "https://imdb.com/title/xyz", "snippet": "Ficha oficial"},
        {"title": "Wikipedia artículo", "url": "https://es.wikipedia.org/wiki/xyz", "snippet": "Artículo enciclopédico"}
    ]

    # Filtrar IMDb, Netflix y Wikipedia
    filtered = [r for r in raw_results if not any(site in r["url"] for site in ["imdb.com", "netflix.com", "wikipedia.org"])]

    return jsonify({"results": filtered})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
