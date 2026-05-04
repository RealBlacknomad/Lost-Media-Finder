from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import urllib.parse

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
    queries = []

    # 💀 MODO DIOS BIEN HECHO
    if search_type == "indexof":
        queries = [
            f'intitle:"index of" {query}',
            f'intitle:"index of" {query} "parent directory"',
            f'intitle:"index of" {query} (mp4 OR avi OR mkv)',
            f'intitle:"index of" {query} (mp3 OR zip OR rar)',
            f'intitle:"index of" {query} -html -htm -php -asp',
        ]

    elif search_type == "blogs":
        queries = [
            f'{query} site:blogspot.com',
            f'{query} site:wordpress.com',
            f'{query} "posted by"',
        ]

    elif search_type == "movies":
        queries = [
            f'{query} pelicula lost media',
            f'{query} full movie rare',
        ]

    elif search_type == "series":
        queries = [
            f'{query} serie lost media',
            f'{query} full episodes rare',
        ]

    else:
        queries = [
            f'{query} lost media -netflix -amazon -disney',
        ]

    # 🔥 GENERAR LINKS LIMPIOS (IMPORTANTE: encode)
    for q in queries:
        encoded_q = urllib.parse.quote(q)

        results.append({
            "title": f"🔎 {q}",
            "url": f"https://www.google.com/search?q={encoded_q}"
        })

    # 🔥 EXTRA SIEMPRE
    results.append({
        "title": f"📚 Archive.org: {query}",
        "url": f"https://archive.org/search?query={urllib.parse.quote(query)}"
    })

    results.append({
        "title": f"💬 Reddit: {query}",
        "url": f"https://www.reddit.com/search/?q={urllib.parse.quote(query)}"
    })

    return jsonify({"results": results})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
