from flask import Flask, jsonify
from flask_cors import CORS
from flask_compress import Compress


import json

app = Flask(__name__)

CORS(app) 
Compress(app)


with open('data.json') as file:
    data = json.load(file)


@app.route('/api/data', methods=['GET'])
def get_tours():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
