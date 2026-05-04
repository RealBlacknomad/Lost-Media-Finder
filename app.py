from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import urllib.parse
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

HEADERS = {"User-Agent": "Mozilla/5.0"}


@app.route("/")
def home():
    return "Backend funcionando 🚀"


# 🎬 DETECTAR TIPO DE ARCHIVO
def get_file_type(url):
    url = url.lower()

    if url.endswith((".mp4", ".mkv", ".avi", ".3gp")):
        return "video"
    if url.endswith((".mp3", ".wav")):
        return "audio"
    if url.endswith((".jpg", ".jpeg", ".png", ".gif")):
        return "image"
    if url.endswith((".zip", ".rar", ".7z")):
        return "archive"

    return "other"


# 📦 EXTRAER ARCHIVOS DE UNA PÁGINA
def extract_files_from_page(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=5)

        # 🔒 evitar HTML raro o bloqueos
        if "text/html" not in res.headers.get("Content-Type", ""):
            return []

        soup = BeautifulSoup(res.text, "lxml")

        files = []

        for a in soup.find_all("a"):
            href = a.get("href")

            if not href:
                continue

            full_url = urllib.parse.urljoin(url, href)

            if any(full_url.lower().endswith(ext) for ext in [
                ".mp4", ".mkv", ".avi",
                ".mp3",
                ".zip", ".rar", ".7z",
                ".jpg", ".png"
            ]):
                files.append({
                    "url": full_url,
                    "type": get_file_type(full_url)
                })

        return files[:10]

    except:
        return []


@app.route("/search")
def search():
    query = request.args.get("q")
    search_type = request.args.get("type", "all")

    if not query:
        return jsonify({"results": []})

    results = []
    queries = []

    # 🎯 MODOS
    if search_type == "movies":
        queries = [f"{query} pelicula"]
    elif search_type == "series":
        queries = [f"{query} serie"]
    elif search_type == "blogs":
        queries = [f"{query} blog OR wordpress OR blogspot"]
    elif search_type == "indexof":
        queries = [f'intitle:"index of" {query}']
    else:
        queries = [query]

    # 🔎 RESULTADOS BASE (sin romper nada)
    for q in queries:
        encoded_q = urllib.parse.quote(q)
        google_url = f"https://www.google.com/search?q={encoded_q}"

        # 🔥 EXTRA: intentar detectar archivos (NO rompe si falla)
        files = extract_files_from_page(google_url)

        results.append({
            "title": f"🔎 {q}",
            "url": google_url,
            "files": files
        })

    # 📚 extras (igual que tu versión original)
    results.append({
        "title": f"📚 Archive.org: {query}",
        "url": f"https://archive.org/search?query={urllib.parse.quote(query)}"
    })

    results.append({
        "title": f"💬 Reddit: {query}",
        "url": f"https://www.reddit.com/search/?q={urllib.parse.quote(query)}"
    })

    return jsonify({
        "results": results
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
