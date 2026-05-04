from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend funcionando 🚀"

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")

    if not query:
        return jsonify({"results": []})

    results = []

    try:
        url = f"https://api.duckduckgo.com/?q={query}&format=json&no_html=1"
        res = requests.get(url, timeout=5)
        data = res.json()

        for item in data.get("RelatedTopics", []):

            if isinstance(item, dict):

                if "Text" in item and "FirstURL" in item:
                    results.append({
                        "title": item["Text"],
                        "url": item["FirstURL"]
                    })

                if "Topics" in item:
                    for sub in item["Topics"]:
                        if "Text" in sub and "FirstURL" in sub:
                            results.append({
                                "title": sub["Text"],
                                "url": sub["FirstURL"]
                            })

    except Exception as e:
        print("Error:", e)

    if not results:
        results = [
            {
                "title": f"Buscar '{query}' en Archive.org",
                "url": f"https://archive.org/search?query={query}"
            },
            {
                "title": f"Buscar '{query}' en Reddit",
                "url": f"https://www.reddit.com/search/?q={query}"
            }
        ]

    return jsonify({"results": results[:10]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)