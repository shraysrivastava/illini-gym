from flask import Flask, jsonify
from scraper import scrape_and_update
import firebase_admin
from firebase_admin import credentials, firestore
import threading
import time
from datetime import datetime, timedelta

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

def is_gym_open(now):
    # Define gym hours
    gym_hours = {
        "Monday": (6, 23),
        "Tuesday": (6, 23),
        "Wednesday": (6, 23),
        "Thursday": (6, 23),
        "Friday": (6, 22),
        "Saturday": (9, 22),
        "Sunday": (9, 22)
    }

    day_name = now.strftime("%A")
    open_hour, close_hour = gym_hours.get(day_name, (0, 0))
    return open_hour <= now.hour < close_hour

if __name__ == '__main__':
    # Start the Flask server in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Add the periodic update loop
    while True:
        current_time = datetime.now()
        if is_gym_open(current_time):
            try:
                scrape_and_update()  # Call the function to scrape and update Firebase
                print(f"[{current_time.strftime('%Y-%m-%d %H:%M:%S')}] Firestore successfully updated.")
            except Exception as e:
                print(f"[{current_time.strftime('%Y-%m-%d %H:%M:%S')}] Error updating Firestore: {e}")
        else:
            next_check_time = current_time + timedelta(minutes=20)
            print(f"[{current_time.strftime('%Y-%m-%d %H:%M:%S')}] Gym is closed. Next check at {next_check_time.strftime('%Y-%m-%d %H:%M:%S')}.")
        
        time.sleep(900)  # Sleep for 20 minutes
