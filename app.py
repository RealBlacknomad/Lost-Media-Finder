from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/search")
def search():
    query = request.args.get("q", "")
    # Aquí pondrás tu lógica de filtrado (ejemplo: excluir IMDb, Netflix, Wikipedia)
    results = [
        {"title": "Ejemplo resultado", "url": "https://example.com", "snippet": f"Búsqueda: {query}"}
    ]
    return jsonify({"results": results})

if __name__ == "__main__":
    # Render necesita que el servicio escuche en 0.0.0.0
    app.run(host="0.0.0.0", port=10000)
