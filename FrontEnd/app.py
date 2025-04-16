from flask import Flask, request, jsonify

app = Flask(__name__)

formations = [
    {
        "id": 1,
        "titre": "Java En Ligne",
        "type": "Enligne",
        "niveau": "Beginner",
        "description": "Découvrez les bases du langage Java, de la syntaxe à la programmation orientée objet, dans une formation interactive en ligne."
    },
    {
        "id": 2,
        "titre": "Spring Boot Vidéo",
        "type": "Video",
        "niveau": "Intermediate",
        "description": "Approfondissez vos connaissances Java avec Spring Boot, apprenez à créer des API REST et à structurer vos projets backend."
    },
    {
        "id": 3,
        "titre": "Angular En Ligne",
        "type": "Enligne",
        "niveau": "Advanced",
        "description": "Maîtrisez le framework Angular : architecture MVVM, composants avancés, services, routage, RxJS et bonnes pratiques pour des applications SPA robustes."
    },
    {
        "id": 4,
        "titre": "Docker Vidéo",
        "type": "Video",
        "niveau": "Intermediate",
        "description": "Apprenez à containeriser vos applications avec Docker, à utiliser Docker Compose et à gérer vos environnements de développement efficacement."
    },
    {
        "id": 5,
        "titre": "CyberSec En Ligne",
        "type": "Enligne",
        "niveau": "Beginner",
        "description": "Initiez-vous à la cybersécurité : comprendre les menaces, les attaques fréquentes, et les bonnes pratiques de sécurisation informatique."
    }
]

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    titles = data.get("titles", [])
    # yekho mot cles mel titles
    keywords = set()
    for title in titles:
        for word in title.lower().split():
            if word not in ["en", "ligne", "vidéo", "boot", "le", "la"]:
                keywords.add(word)
    result = []
    for f in formations:
        titre_lower = f["titre"].lower()
        if any(kw in titre_lower for kw in keywords):
            result.append(f)
    if not result:
        result = formations
    return jsonify(result), 200
if __name__ == '__main__':
    app.run(debug=True, port=5001)
