from flask import Flask, request, jsonify
import os
import markdown
import re

app = Flask(__name__)

KB_DIR = '/opt/axentx/cloud-lab/kb/'

def search_kb(query):
    articles = []
    for filename in os.listdir(KB_DIR):
        if filename.endswith('.md'):
            with open(os.path.join(KB_DIR, filename), 'r') as file:
                content = file.read()
                if re.search(query, content, re.IGNORECASE):
                    articles.append({
                        'title': filename[:-3],  # Remove .md extension
                        'content': markdown.markdown(content)
                    })
    return sorted(articles, key=lambda x: x['title'])[:5]  # Sort by title for relevance

@app.route('/api/kb_search', methods=['GET'])
def kb_search():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = search_kb(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)