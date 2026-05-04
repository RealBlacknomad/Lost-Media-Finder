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

# 🔎 EXTRAER LINKS DE GOOGLE
def get_google_links(query):
    url = f"https://www.google.com/search?q={urllib.parse.quote(query)}"
    res = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(res.text, "lxml")

    links = []

    for a in soup.select("a"):
        href = a.get("href")

        if href and "/url?q=" in href:
            link = href.split("/url?q=")[1].split("&")[0]

            if not link.startswith("http"):
                continue

            if any(x in link for x in ["google", "youtube", "wikipedia"]):
                continue

            links.append(link)

    return links[:10]


# 📁 DETECTAR INDEX (MEJORADO)
def is_index_page(html):
    text = html.lower()
    return (
        "index of" in text or
        "directory listing" in text or
        "<title>index of" in text
    )


# 🎬 CLASIFICAR ARCHIVOS
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


# 📦 EXTRAER ARCHIVOS Y CARPETAS
def extract_content(html, base_url):
    soup = BeautifulSoup(html, "lxml")

    files = []
    folders = []

    extensions = (
        ".mp4", ".mkv", ".avi", ".3gp",
        ".mp3", ".wav",
        ".jpg", ".jpeg", ".png", ".gif",
        ".zip", ".rar", ".7z"
    )

    for a in soup.find_all("a"):
        href = a.get("href")

        if not href:
            continue

        full_url = urllib.parse.urljoin(base_url, href)

        # 📁 carpetas
        if href.endswith("/") and href != "../":
            folders.append(full_url)

        # 🎬 archivos reales
        elif href.lower().endswith(extensions):
            files.append({
                "url": full_url,
                "type": get_file_type(full_url)
            })

    return folders[:10], files[:20]


@app.route("/search")
def search():
    query = request.args.get("q")
    search_type = request.args.get("type", "all")

    if not query:
        return jsonify({"results": []})

    results = []
    queries = []

    # 💀 MODOS
    if search_type == "indexof":
        queries = [
            f'intitle:"index of" {query}',
            f'intitle:"index of" {query} "parent directory"',
        ]
    else:
        queries = [f'{query} lost media']

    real_results = []

    # 🔥 SCRAPING REAL
    for q in queries:
        try:
            links = get_google_links(q)

            for link in links:
                try:
                    res = requests.get(link, headers=HEADERS, timeout=8)

                    if is_index_page(res.text):
                        folders, files = extract_content(res.text, link)

                        real_results.append({
                            "title": "📁 Index encontrado",
                            "url": link,
                            "folders": folders,
                            "files": files
                        })

                        # 🔒 limitar resultados
                        if len(real_results) >= 5:
                            break

                except:
                    continue

        except:
            continue

    # 🔎 fallback (Google links normales)
    for q in queries:
        encoded_q = urllib.parse.quote(q)

        results.append({
            "title": f"🔎 {q}",
            "url": f"https://www.google.com/search?q={encoded_q}"
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
        "results": real_results + results
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)