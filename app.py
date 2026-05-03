from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"mensaje": "API Lost Media Finder activa"})

@app.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"results": []})

    try:
        # Endpoint público de DuckDuckGo (no oficial)
        url = "https://api.duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_redirect": 1,
            "no_html": 1
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        raw_results = []

        # DuckDuckGo devuelve 'RelatedTopics' como lista de resultados
        for item in data.get("RelatedTopics", []):
            if "Text" in item and "FirstURL" in item:
                raw_results.append({
                    "title": item.get("Text", "Sin título"),
                    "url": item.get("FirstURL", ""),
                    "snippet": item.get("Text", "")
                })

        # Filtrar IMDb, Netflix y Wikipedia
        filtered = [
            r for r in raw_results
            if not any(site in r["url"] for site in ["imdb.com", "netflix.com", "wikipedia.org"])
        ]

        return jsonify({"results": filtered})

    except Exception as e:
        return jsonify({"error": str(e), "results": []})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
