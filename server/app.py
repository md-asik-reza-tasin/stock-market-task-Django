from flask import Flask, jsonify
from flask_cors import CORS
from flask_compress import Compress
import sqlite3
import json

app = Flask(__name__)

# Enable CORS and compression for the app
CORS(app)
Compress(app)

# Initialize the database and create the table if it doesn't exist
def init_db():
    with sqlite3.connect('stock_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_data (
            id INTEGER PRIMARY KEY,
            date TEXT,
            trade_code TEXT,
            high REAL,
            low REAL,
            open REAL,
            close REAL,
            volume INTEGER
        )
        ''')
        conn.commit()

# Insert data from JSON into SQLite database
def insert_data():
    with open('data.json', 'r') as file:
        data = json.load(file)

    with sqlite3.connect('stock_data.db') as conn:
        cursor = conn.cursor()
        for item in data:
            cursor.execute('''
            INSERT INTO stock_data (date, trade_code, high, low, open, close, volume)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (item['date'], item['trade_code'], item['high'], item['low'], item['open'], item['close'], item['volume']))
        conn.commit()

# Endpoint to fetch data from the database
@app.route('/api/data', methods=['GET'])
def get_data():
    with sqlite3.connect('stock_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM stock_data")
        rows = cursor.fetchall()

    # Convert rows to list of dictionaries
    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "date": row[1],
            "trade_code": row[2],
            "high": row[3],
            "low": row[4],
            "open": row[5],
            "close": row[6],
            "volume": row[7]
        })

    return jsonify(data)

if __name__ == '__main__':
    init_db()  # Initialize the database and create the table
    insert_data()  # Insert data from JSON into the database (only once)
    app.run(debug=True)
