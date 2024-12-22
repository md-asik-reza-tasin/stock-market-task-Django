from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_compress import Compress
import sqlite3
import json
import time

app = Flask(__name__)

# Enable CORS and compression for the app
CORS(app)
Compress(app)

DATABASE = 'stock_data.db'

# Get database connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Initialize the database and create the table if it doesn't exist
def init_db():
    with sqlite3.connect(DATABASE) as conn:
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

# Insert data from JSON into SQLite database (only if table is empty)
def insert_data():
    with open('data.json', 'r') as file:
        data = json.load(file)

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM stock_data")
        if cursor.fetchone()[0] == 0:
            for item in data:
                cursor.execute('''
                INSERT INTO stock_data (date, trade_code, high, low, open, close, volume)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (item['date'], item['trade_code'], item['high'], item['low'], 
                      item['open'], item['close'], item['volume']))
            conn.commit()

# Middleware for request timing
@app.before_request
def log_request():
    g.start_time = time.time()

@app.after_request
def log_response(response):
    duration = time.time() - g.start_time
    print(f"Request: {request.method} {request.url}, Duration: {duration:.2f} seconds")
    return response


@app.route('/api/trade_codes', methods=['GET'])
def get_trade_codes():
    try:
        # Connect to the database
        conn = sqlite3.connect('stock_data.db')
        cursor = conn.cursor()

        # Fetch unique trade codes
        cursor.execute("SELECT DISTINCT trade_code FROM stock_data")
        rows = cursor.fetchall()

        # Convert to a list
        trade_codes = [row[0] for row in rows]

        return jsonify({"trade_codes": trade_codes}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()




# Endpoint to fetch **all data**
@app.route('/api/data', methods=['GET'])
def get_stock_data():
    try:
        # Get the 'trade_code' parameter from the query string
        trade_code = request.args.get('trade_code')

        conn = get_db()
        cursor = conn.cursor()

        if trade_code:
            # If 'trade_code' is provided, fetch specific data
            query = "SELECT * FROM stock_data WHERE trade_code = ?"
            cursor.execute(query, (trade_code,))
        else:
            # If no 'trade_code' is provided, fetch all data
            query = "SELECT DISTINCT trade_code FROM stock_data"
            cursor.execute(query)

        rows = cursor.fetchall()

        # Convert rows to list of dictionaries
        if trade_code:
            # For specific trade code, return detailed stock data
            data = [
                {
                    "id": row[0],
                    "date": row[1],
                    "trade_code": row[2],
                    "high": row[3],
                    "low": row[4],
                    "open": row[5],
                    "close": row[6],
                    "volume": row[7],
                }
                for row in rows
            ]
        else:
            # For no trade code, return only available trade codes
            data = [{"trade_code": row[0]} for row in rows]

        return jsonify(data), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


# API route to insert new data
@app.route('/api/data', methods=['POST'])
def add_data():
    try:
        stock_data = request.json
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO stock_data (date, trade_code, high, low, open, close, volume)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (stock_data['date'], stock_data['tradeCode'], stock_data['high'],
              stock_data['low'], stock_data['open'], stock_data['close'], stock_data['volume']))
        conn.commit()
        return jsonify({"message": "Stock data added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

# API route to delete data by ID
@app.route('/api/data/<int:id>', methods=['DELETE'])
def delete_data(id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM stock_data WHERE id = ?", (id,))
        conn.commit()
        return jsonify({"message": "Data deleted successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data/<int:id>', methods=['PUT'])
def update_data(id):
    try:
        # Get the updated stock data from the request body
        stock_data = request.json
        
        conn = get_db()
        cursor = conn.cursor()

        # Check if the record with the given ID exists
        cursor.execute("SELECT * FROM stock_data WHERE id = ?", (id,))
        row = cursor.fetchone()

        if row is None:
            return jsonify({"error": "Stock data not found"}), 404

        # Update the stock data with the new values
        cursor.execute('''
        UPDATE stock_data 
        SET date = ?, trade_code = ?, high = ?, low = ?, open = ?, close = ?, volume = ? 
        WHERE id = ?
        ''', (stock_data['date'], stock_data['tradeCode'], stock_data['high'],
              stock_data['low'], stock_data['open'], stock_data['close'], stock_data['volume'], id))

        conn.commit()

        return jsonify({"message": "Stock data updated successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

    

if __name__ == '__main__':
    init_db()  # Initialize the database and create the table

    # Insert data only if the table is empty
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM stock_data")
        if cursor.fetchone()[0] == 0:
            insert_data()

    app.run(debug=True)
