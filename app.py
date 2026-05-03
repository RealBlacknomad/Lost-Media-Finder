import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "API Lost Media Finder activa"})

@app.route("/search")
def search():
    query = request.args.get("q")
    if not query:
        return jsonify({"results": []})

    # Consulta a DuckDuckGo API
    url = f"https://api.duckduckgo.com/?q={query}&format=json"
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
    except Exception as e:
        return jsonify({"results": [], "error": str(e)})

    results = []
    for item in data.get("RelatedTopics", []):
        # Algunos items son sublistas, hay que revisar
        if isinstance(item, dict):
            if "Text" in item and "FirstURL" in item:
                # Filtrar IMDb, Wikipedia, Netflix
                if any(domain in item["FirstURL"] for domain in ["imdb.com", "wikipedia.org", "netflix.com"]):
                    continue
                results.append({
                    "title": item["Text"],
                    "url": item["FirstURL"],
                    "snippet": item["Text"]
                })
            # Si hay subtopics
            if "Topics" in item:
                for sub in item["Topics"]:
                    if "Text" in sub and "FirstURL" in sub:
                        if any(domain in sub["FirstURL"] for domain in ["imdb.com", "wikipedia.org", "netflix.com"]):
                            continue
                        results.append({
                            "title": sub["Text"],
                            "url": sub["FirstURL"],
                            "snippet": sub["Text"]
                        })

    return jsonify({"results": results})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
