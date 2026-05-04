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


# 📦 EXTRAER ARCHIVOS
def extract_files_from_page(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=5)

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


# 🔎 GENERADOR DE URL SEGÚN MOTOR
def build_search_url(engine, query):

    q = urllib.parse.quote(query)

    if engine == "google":
        return f"https://www.google.com/search?q={q}"

    elif engine == "duckduckgo":
        return f"https://duckduckgo.com/?q={q}"

    elif engine == "yandex":
        return f"https://yandex.com/search/?text={q}"

    elif engine == "bing":
        return f"https://www.bing.com/search?q={q}"

    return None


@app.route("/search")
def search():

    query = request.args.get("q")
    search_type = request.args.get("type", "all")
    engines = request.args.get("engines", "google").split(",")

    if not query:
        return jsonify({"results": []})

    results = []

    # 🎯 MODOS
    if search_type == "movies":
        query += " pelicula"
    elif search_type == "series":
        query += " serie"
    elif search_type == "blogs":
        query += " (blog OR wordpress OR blogspot)"
    elif search_type == "indexof":
        query = f'intitle:"index of" {query}'

    # 🔍 BUSCAR EN CADA MOTOR
    for engine in engines:

        search_url = build_search_url(engine, query)

        if not search_url:
            continue

        # 🔥 intentar detectar archivos
        files = extract_files_from_page(search_url)

        results.append({
            "title": f"🔎 {engine.upper()} | {query}",
            "url": search_url,
            "files": files
        })

    # 📚 extras
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
