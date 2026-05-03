from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)  # habilita CORS para todas las rutas

@app.route("/")
def home():
    return jsonify({"mensaje": "API Lost Media Finder activa"})

@app.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"results": []})

    try:
        # Llamada al motor externo Marginalia Search
        url = f"https://search.marginalia.nu/search?query={query}&format=json"
        response = requests.get(url, timeout=10)
        data = response.json()

        # Marginalia devuelve resultados en 'results'
        raw_results = data.get("results", [])

        # Filtrar IMDb, Netflix y Wikipedia
        filtered = [
            {
                "title": r.get("title", "Sin título"),
                "url": r.get("url", ""),
                "snippet": r.get("description", "")
            }
            for r in raw_results
            if not any(site in r.get("url", "") for site in ["imdb.com", "netflix.com", "wikipedia.org"])
        ]

        return jsonify({"results": filtered})

    except Exception as e:
        return jsonify({"error": str(e), "results": []})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
