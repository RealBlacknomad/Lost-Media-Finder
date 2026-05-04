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

    # 🔥 FUENTE 1: DuckDuckGo
    try:
        url = f"https://api.duckduckgo.com/?q={query}&format=json&no_redirect=1"
        res = requests.get(url, timeout=3)
        data = res.json()

        for item in data.get("RelatedTopics", []):
            if isinstance(item, dict):
                if "Text" in item and "FirstURL" in item:
                    results.append({
                        "title": item["Text"],
                        "url": item["FirstURL"]
                    })
    except Exception as e:
        print("DuckDuckGo falló:", e)

    # 🔥 SI NO HAY RESULTADOS → FORZAR RESULTADOS REALES
    if len(results) < 3:

        results.append({
            "title": f"🔎 Buscar '{query}' (modo limpio)",
            "url": f"https://www.google.com/search?q={query}+lost+media+-netflix+-amazon+-disney"
        })

        results.append({
            "title": f"📚 Archive.org: {query}",
            "url": f"https://archive.org/search?query={query}"
        })

        results.append({
            "title": f"💬 Reddit: {query}",
            "url": f"https://www.reddit.com/search/?q={query}"
        })

    return jsonify({"results": results})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
