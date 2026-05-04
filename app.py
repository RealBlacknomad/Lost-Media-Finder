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

    # 💀 MODO DIOS: múltiples estrategias
    queries = []

    if search_type == "indexof":
        queries = [
            f'intitle:"index of" {query}',
            f'intitle:"index of" {query} (mp4 OR avi OR mkv OR mp3 OR zip)',
            f'intitle:"index of" {query} -html -htm -php',
    ]

    elif search_type == "blogs":
        queries = [
            f'{query} site:blogspot.com',
            f'{query} site:wordpress.com',
        ]

    elif search_type == "movies":
        queries = [f'{query} pelicula lost media']

    elif search_type == "series":
        queries = [f'{query} serie lost media']

    else:
        queries = [f'{query} lost media -netflix -amazon -disney']

    # 🔥 Generar resultados Google para cada estrategia
    for q in queries:
        results.append({
            "title": f"🔎 {q}",
            "url": f"https://www.google.com/search?q={q}"
        })

    # 🔥 EXTRA: Archive y Reddit siempre
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
