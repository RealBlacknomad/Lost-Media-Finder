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

    # 🔥 FUENTE 1: DuckDuckGo (solo para modo normal)
    if search_type == "all":
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

    # 🔥 SI NO HAY RESULTADOS O ES MODO ESPECIAL
    if len(results) < 3:

        # 📁 INDEX OF
        if search_type == "indexof":
            results.append({
                "title": f"📁 Index Of: {query}",
                "url": f"https://www.google.com/search?q=intitle:index.of+{query}+(mp4|avi|mkv|mp3)"
            })

        # 📝 BLOGS
        elif search_type == "blogs":
            results.append({
                "title": f"📝 Blogs: {query}",
                "url": f"https://www.google.com/search?q={query}+site:blogspot.com+OR+site:wordpress.com"
            })

        # 🎬 PELÍCULAS
        elif search_type == "movies":
            results.append({
                "title": f"🎬 Buscar película: {query}",
                "url": f"https://www.google.com/search?q={query}+pelicula+lost+media"
            })

        # 📺 SERIES
        elif search_type == "series":
            results.append({
                "title": f"📺 Buscar serie: {query}",
                "url": f"https://www.google.com/search?q={query}+serie+lost+media"
            })

        # 🌐 DEFAULT (modo limpio)
        else:
            results.append({
                "title": f"🔎 Buscar '{query}' (limpio)",
                "url": f"https://www.google.com/search?q={query}+lost+media+-netflix+-amazon+-disney"
            })

        # 🔥 SIEMPRE agregar estas fuentes
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
