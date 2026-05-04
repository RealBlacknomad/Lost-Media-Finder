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

    try:
        url = f"https://api.duckduckgo.com/?q={query}&format=json"

        # 🔥 AQUÍ ESTÁ LA CLAVE
        res = requests.get(url, timeout=5)

        data = res.json()
        results = []

        if "RelatedTopics" in data:
            for item in data["RelatedTopics"]:
                if isinstance(item, dict):
                    if "Text" in item and "FirstURL" in item:
                        results.append({
                            "title": item["Text"],
                            "url": item["FirstURL"]
                        })

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
