import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/search")
def search():
    query = request.args.get("q")
    url = f"https://api.duckduckgo.com/?q={query}&format=json"
    r = requests.get(url)
    data = r.json()

    results = []
    for item in data.get("RelatedTopics", []):
        if "Text" in item and "FirstURL" in item:
            results.append({
                "title": item["Text"],
                "url": item["FirstURL"],
                "snippet": item["Text"]
            })

    return jsonify({"results": results})
