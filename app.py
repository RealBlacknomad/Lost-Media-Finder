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

            if "google" not in link:
                links.append(link)

    return links[:8]

# 📁 DETECTAR INDEX
def is_index_page(html):
    text = html.lower()
    return "index of" in text and "parent directory" in text

# 🎬 EXTRAER ARCHIVOS
def extract_files(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    files = []

    extensions = [
        ".mp4", ".mkv", ".avi", ".3gp",
        ".mp3", ".wav",
        ".jpg", ".jpeg", ".png", ".gif",
        ".zip", ".rar"
    ]

    for a in soup.find_all("a"):
        href = a.get("href")
        if not href:
            continue

        full_url = urllib.parse.urljoin(base_url, href)

        if any(ext in href.lower() for ext in extensions):
            files.append(full_url)

    return files[:15]

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
                    res = requests.get(link, headers=HEADERS, timeout=5)

                    if is_index_page(res.text):
                        files = extract_files(res.text, link)

                        real_results.append({
                            "title": "📁 Index encontrado",
                            "url": link,
                            "files": files
                        })

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
