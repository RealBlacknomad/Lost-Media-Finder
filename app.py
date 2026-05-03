from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

# Obtén tu clave de Bing Web Search API desde Azure Portal
BING_API_KEY = os.environ.get("BING_API_KEY")
BING_ENDPOINT = "https://api.bing.microsoft.com/v7.0/search"

@app.route("/")
def home():
    return jsonify({"mensaje": "API Lost Media Finder activa"})

@app.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"results": []})

    try:
        headers = {"Ocp-Apim-Subscription-Key": BING_API_KEY}
        params = {"q": query, "count": 10, "mkt": "es-ES"}
        response = requests.get(BING_ENDPOINT, headers=headers, params=params, timeout=10)
        data = response.json()

        # Bing devuelve resultados en 'webPages' → 'value'
        raw_results = data.get("webPages", {}).get("value", [])

        # Filtrar IMDb, Netflix y Wikipedia
        filtered = [
            {
                "title": r.get("name", "Sin título"),
                "url": r.get("url", ""),
                "snippet": r.get("snippet", "")
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
