# app.py

from flask import Flask, jsonify
from scraper import scrape_and_update
import threading
import time

app = Flask(__name__)

@app.route('/update_firestore', methods=['GET'])
def update_firestore():
    try:
        scrape_and_update()
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
            print("Firestore updated. Waiting for the next update...")
            time.sleep(3600)  # Sleep for 1 hour (adjust as needed)
        except Exception as e:
            print(f"Error updating Firestore: {str(e)}")



