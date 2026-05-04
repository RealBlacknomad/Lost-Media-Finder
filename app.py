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

    results = []

    # 🔹 intento DuckDuckGo
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
    except:
        print("DuckDuckGo falló")

    # 🔹 fallback (SIEMPRE FUNCIONA)
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
            "title": f"Buscar '{query}' en Google (filtrado)",
            "url": f"https://www.google.com/search?q={query}+lost+media"
        })

    return jsonify({"results": results})

        return jsonify({"results": results})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "results": [],
            "error": "Error al obtener datos externos"
        })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
