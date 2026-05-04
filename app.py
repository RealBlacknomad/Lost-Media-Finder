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
    search_type = request.args.get("type", "all")

    if not query:
        return jsonify({"results": []})

    results = []

    # 🧠 MODIFICAR QUERY SEGÚN MODO
    final_query = query

    if search_type == "indexof":
        final_query = f'intitle:"index of" {query} (mp4|avi|mkv|mp3|jpg|png|zip)'

    elif search_type == "blogs":
        final_query = f'{query} (site:blogspot.com OR site:wordpress.com)'

    elif search_type == "movies":
        final_query = f'{query} pelicula lost media'

    elif search_type == "series":
        final_query = f'{query} serie lost media'

    else:
        final_query = f'{query} lost media -netflix -amazon -disney'

    # 🔥 DuckDuckGo SOLO modo normal
    if search_type == "all":
        try:
            url = f"https://api.duckduckgo.com/?q={final_query}&format=json&no_redirect=1"
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

    # 🔥 SIEMPRE añadir búsqueda Google optimizada
    results.append({
        "title": f"🔎 Google: {final_query}",
        "url": f"https://www.google.com/search?q={final_query}"
    })

    # 📁 EXTRA POTENTE PARA INDEX OF
    if search_type == "indexof":
        results.append({
            "title": f"📁 Index Of directo (alternativo)",
            "url": f"https://www.google.com/search?q=intitle:index.of+{query}"
        })

    # 🔥 FUENTES CLAVE
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
