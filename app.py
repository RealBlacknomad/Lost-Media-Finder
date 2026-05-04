from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend funcionando 🚀"

@app.route("/search")
def search():
    query = request.args.get("q")

    if not query:
        return jsonify({"results": []})

    results = []

    try:
        url = f"https://api.duckduckgo.com/?q={query}&format=json"
        res = requests.get(url, timeout=3)
        data = res.json()

        if "RelatedTopics" in data:
            for item in data["RelatedTopics"]:
                if isinstance(item, dict):
                    if "Text" in item and "FirstURL" in item:
                        results.append({
                            "title": item["Text"],
                            "url": item["FirstURL"]
                        })
    except Exception as e:
        print("DuckDuckGo falló:", e)

    if not results:
        results.append({
            "title": f"Buscar '{query}' en Archive.org",
            "url": f"https://archive.org/search?query={query}"
        })

        results.append({
            "title": f"Buscar '{query}' en Reddit",
            "url": f"https://www.reddit.com/search/?q={query}"
        })

        results.append({
            "title": f"Buscar '{query}' en Google (lost media)",
            "url": f"https://www.google.com/search?q={query}+lost+media"
        })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
