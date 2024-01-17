# app.py

from flask import Flask, jsonify
from scraper import scrape_and_update
from scraper import scrape_and_update_cerce
import firebase_admin
from firebase_admin import credentials, firestore
import threading
import time
from datetime import datetime

app = Flask(__name__)

@app.route('/update_firestore', methods=['GET'])
def update_firestore():
    try:
        scrape_and_update()
        scrape_and_update_cerce()
        return jsonify({"status": "Firestore updated with scraped data."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run_flask():
    app.run(debug=True, use_reloader=False)  # Disable the reloader

if __name__ == '__main__':
    # Start the Flask server in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Add the periodic update loop
    while True:
        try:
            scrape_and_update()  # Call the function to scrape and update Firebase
            # scrape_and_update_cerce()
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"Firestore updated at {current_time}. Waiting for the next update...")
            time.sleep(1200)  # Sleep for 1 hour (adjust as needed)
        except Exception as e:
            print(f"Error updating Firestore: {str(e)}")
