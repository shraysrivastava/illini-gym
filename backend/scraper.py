
# scraper.py
import csv
from io import StringIO
import firebase_admin
from firebase_admin import credentials, storage
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
import firebase_admin
from firebase_admin import credentials, firestore
from faker import Faker
import random
from datetime import datetime
import pytz
from selenium.webdriver.chrome.options import Options

POPULAR_SECTIONS = set([])
UPPER_LEVEL = set(["upper-level",])
ENTRANCE_LEVEL = set(["gym-2", "gym-3", "mp-room-1", "mp-room-2", "gym-1", "mp-room-3", "mp-room-4", "mp-room-5", "mp-room-6","combat-room","entrance-level-fitness-area"])
CONCOURSE_LEVEL = set(["strength-and-conditioning-zone","sauna","rock-wall","mp-room-7","meeting-room-2","meeting-room-3","instructional-kitchen","indoor-pool",])
LOWER_LEVEL = set(["squash-courts","raquetball-courts","power-pod","olympic-pod","lower-level","hiit-pod"])
EDIT_ROOM_NAMES = {
    "strength-and-conditioning-zone": "Strength & Conditioning",
}
EDIT_CAPACITY = {
    "strength-and-conditioning-zone": 250,
    "gym-1": 400,
}
KEYS_TO_REMOVE = set(["meeting-room-1", "meeting-room-2", "meeting-room-3", "instructional-kitchen"])
# Initialize Firebase Admin
cred = credentials.Certificate("./firebase.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def scrape_and_update(collection_id):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("start-maximized")  # Open the browser in maximized mode
    chrome_options.add_argument("disable-infobars")  # Disable infobars
    chrome_options.add_argument("--disable-extensions")  # Disable extensions
    chrome_options.add_argument("--disable-gpu")  # Applicable to Windows OS only
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument('headless')  # Run Chrome in headless mode
    driver = webdriver.Chrome(options=chrome_options)
    url = 'https://apps2.campusrec.illinois.edu/checkins/live'
    options = webdriver.ChromeOptions()
    browser = webdriver.Chrome(options=options)
    browser.get(url)

    # Your XPaths go here
    xpaths = [
    '/html/body/div/div/div[2]/div[1]/div/div[2]',
    '/html/body/div/div/div[2]/div[2]/div/div[2]',
    '/html/body/div/div/div[2]/div[3]/div/div[2]',
    '/html/body/div/div/div[2]/div[4]/div/div[2]',
    '/html/body/div/div/div[2]/div[5]/div/div[2]',
    '/html/body/div/div/div[2]/div[6]/div/div[2]',
    '/html/body/div/div/div[2]/div[7]/div/div[2]',
    '/html/body/div/div/div[2]/div[8]/div/div[2]',
    '/html/body/div/div/div[2]/div[9]/div/div[2]',
    '/html/body/div/div/div[2]/div[10]/div/div[2]',
    '/html/body/div/div/div[2]/div[11]/div/div[2]',
    '/html/body/div/div/div[2]/div[12]/div/div[2]',
    '/html/body/div/div/div[2]/div[13]/div/div[2]',
    '/html/body/div/div/div[2]/div[14]/div/div[2]',
    '/html/body/div/div/div[2]/div[15]/div/div[2]',
    '/html/body/div/div/div[2]/div[16]/div/div[2]',
    '/html/body/div/div/div[2]/div[17]/div/div[2]',
    '/html/body/div/div/div[2]/div[18]/div/div[2]',
    '/html/body/div/div/div[2]/div[19]/div/div[2]',
    '/html/body/div/div/div[2]/div[20]/div/div[2]',
    '/html/body/div/div/div[2]/div[21]/div/div[2]',
    '/html/body/div/div/div[2]/div[22]/div/div[2]',
    '/html/body/div/div/div[2]/div[23]/div/div[2]',
    '/html/body/div/div/div[2]/div[24]/div/div[2]',
    '/html/body/div/div/div[2]/div[25]/div/div[2]',
    '/html/body/div/div/div[2]/div[26]/div/div[2]',
    '/html/body/div/div/div[2]/div[27]/div/div[2]',
    '/html/body/div/div/div[2]/div[28]/div/div[2]',
    '/html/body/div/div/div[2]/div[29]/div/div[2]',
    '/html/body/div/div/div[2]/div[30]/div/div[2]',
    '/html/body/div/div/div[2]/div[31]/div/div[2]',
    '/html/body/div/div/div[2]/div[32]/div/div[2]',
    '/html/body/div/div/div[2]/div[33]/div/div[2]',
    '/html/body/div/div/div[2]/div[34]/div/div[2]',
    '/html/body/div/div/div[2]/div[35]/div/div[2]',
    '/html/body/div/div/div[2]/div[36]/div/div[2]',
    '/html/body/div/div/div[4]/div[1]',
    '/html/body/div/div/div[4]/div[2]',
    '/html/body/div/div/div[4]/div[3]',
    '/html/body/div/div/div[4]/div[4]',
    '/html/body/div/div/div[4]/div[5]',
    '/html/body/div/div/div[4]/div[6]',
    '/html/body/div/div/div[4]/div[7]',
    '/html/body/div/div/div[4]/div[8]',
    '/html/body/div/div/div[4]/div[10]',
    '/html/body/div/div/div[4]/div[11]',
    '/html/body/div/div/div[4]/div[12]',
    '/html/body/div/div/div[4]/div[13]',
    '/html/body/div/div/div[4]/div[14]',
    '/html/body/div/div/div[4]/div[15]',
    '/html/body/div/div/div[4]/div[16]',
    '/html/body/div/div/div[4]/div[17]',
    '/html/body/div/div/div[4]/div[18]',
    '/html/body/div/div/div[4]/div[19]',
    '/html/body/div/div/div[4]/div[20]',
    '/html/body/div/div/div[4]/div[21]',
    '/html/body/div/div/div[4]/div[22]',
    '/html/body/div/div/div[4]/div[23]',
    '/html/body/div/div/div[4]/div[24]',
    '/html/body/div/div/div[4]/div[25]',
    '/html/body/div/div/div[4]/div[26]',
    '/html/body/div/div/div[4]/div[27]',
    '/html/body/div/div/div[4]/div[28]',
    '/html/body/div/div/div[4]/div[29]',
    '/html/body/div/div/div[4]/div[30]',
    '/html/body/div/div/div[4]/div[31]',
    '/html/body/div/div/div[4]/div[32]',
    '/html/body/div/div/div[4]/div[33]',
    '/html/body/div/div/div[4]/div[34]',
    '/html/body/div/div/div[4]/div[35]',
    '/html/body/div/div/div[4]/div[36]',
    ]

    data_ = {}
    for path in xpaths:
        try:
            element = WebDriverWait(browser, 0).until(
                EC.presence_of_element_located((By.XPATH, path))
            )
            text = element.text.split('\n')

        # Extract the relevant data from the text list
            section_key = text[0].strip().lower().replace(" ", "-") if len(text) > 0 else None
            status = text[1].strip("()") if len(text) > 1 else None
            last_count_data = text[2].split(' ') if len(text) > 2 else None
            last_count = last_count_data[2] if last_count_data and len(last_count_data) > 2 else None
            capacity = last_count_data[4] if last_count_data and len(last_count_data) > 4 else None  # Extracting capacity
            last_updated = text[3].strip() if len(text) > 3 else None
        
        # Normalize the status to a boolean value
            is_open = True if status.lower() == "open" else False

            if section_key:
                data_[section_key] = {
                    "name": determine_room_name(section_key),  # Convert back to title case for the name field
                    "count": int(last_count),
                    "capacity": determine_capacity(section_key, int(capacity)),  # Added capacity
                    "isOpen": is_open,
                    "lastUpdated": last_updated,  # This should now hold the correct date and time
                    "key": section_key,
                    "gym": "arc",
                    "isPopular": determine_popularity(section_key),
                    "level" : determine_level(section_key)
                }
            print(f"Room Name: {section_key}")
            print(f"Status: {status}")
            print(f"Last Count: {last_count}")
            print(f"Capacity: {capacity}")
            print(f"Last Updated: {last_updated}")

        except TimeoutException:
            print(f"Element with XPath {path} not found. Skipping to next.")
            continue  # Skip the current iteration and continue with the next XPath
    # Quit the browser once done scraping
    browser.quit()

    # Update Firestore
    
    for section_key, room_data in data_.items():
        if section_key in KEYS_TO_REMOVE:
            continue
        doc_ref = db.collection(collection_id).document(section_key)
        doc_ref.set(room_data, merge=True)  # Use set with merge=True to create or update
    
    # Converting data to CSV format
    existing_csv_data = get_existing_csv_data()
    csv_file = StringIO(existing_csv_data)
    csv_writer = csv.writer(csv_file)

    # Check if it's the first time creating the CSV, if so, write headers
    if not existing_csv_data:
        csv_writer.writerow(['Room Name', 'Status', 'Last Count', 'Capacity', 'Last Updated', 'key', 'gym', 'isPopular'])

    # Append new data
    for room_data in data_.values():
        csv_writer.writerow([room_data['name'], room_data['isOpen'], room_data['count'], room_data['capacity'], room_data['lastUpdated'], room_data['key'], room_data['gym'], room_data['isPopular']])

    new_csv_data = csv_file.getvalue()
    csv_file.close()

    # Update the CSV data in Firestore
    update_csv_data_in_firestore(new_csv_data)
    

def determine_popularity(section_key) -> bool:
    return bool(section_key in POPULAR_SECTIONS)

def determine_room_name(section_key) -> str:
    if section_key in EDIT_ROOM_NAMES:
        return EDIT_ROOM_NAMES[section_key]
    else:
        return section_key.replace("-", " ").title()
    
def determine_capacity(section_key, capacity) -> int:
    if section_key in EDIT_CAPACITY:
        return EDIT_CAPACITY[section_key]
    else:
        return capacity

def determine_level(section_key) -> str:
    if section_key in UPPER_LEVEL:
        return "Upper"
    elif section_key in ENTRANCE_LEVEL:
        return "Entrance"
    elif section_key in CONCOURSE_LEVEL:
        return "Concourse"
    elif section_key in LOWER_LEVEL:
        return "Lower"
    else:
        return "unknown"

#THIS IS PHONY SHIT NOT REAL AT ALL FUCK CRCE
#scrape_and_update() only used to test output of this
def generate_fake_data_cerce(faker, num_entries=10):
    fake_data = {}
    gym_room_names = ["Cardio Zone", "Strength Training", "Yoga Studio", "Cycling Room", "Aquatics Center", "Functional Fitness", "Dance Hall", "Pilates Studio", "Crossfit Area", "Free Weights Zone"]
    for name in gym_room_names:
        room_name = name.title().replace(" ", "-").lower()  # Generates a random word as the room name
        fake_entry = {
            "name": room_name,  # Convert back to title case for the name field
            "count": faker.random_int(min=0, max=100),  # Random count between 0 and 100
            "capacity": faker.random_int(min=100, max=200),  # Random capacity between 100 and 200
            "isOpen": faker.boolean(),  # Randomly True or False
            "lastUpdated": datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Current date and time
        }
        fake_data[room_name] = fake_entry  # This line should be inside the loop
        print(f"Room Name: {room_name}")

    return fake_data

def scrape_and_update_cerce():

    faker = Faker()
    fake_data = generate_fake_data_cerce(faker, num_entries=20)  # Generates 20 fake entries

    # Update Firestore with fake data
    fake_collection_id = "crce"
    for room_name, room_data in fake_data.items():
        doc_ref = db.collection(fake_collection_id).document(room_name)
        doc_ref.set(room_data, merge=True)  # Create or update document


#Helper functions for accumulating csv data

def get_existing_csv_data():
    collection_name = "Arc_ml_data"  # Your actual collection name
    document_name = "cumulative_csv_data"
    try:
        doc_ref = db.collection(collection_name).document(document_name)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict().get("csv_data", "")
        else:
            return ""
    except Exception as e:
        print(f"Error reading Firestore: {e}")
        return ""

# Function to update CSV data in Firestore
def update_csv_data_in_firestore(new_csv_data):
    collection_name = "Arc_ml_data"  # Your actual collection name
    document_name = "cumulative_csv_data"
    try:
        db.collection(collection_name).document(document_name).set({"csv_data": new_csv_data}, merge=True)
        print("CSV data updated in Firestore.")
    except Exception as e:
        print(f"Error updating Firestore: {e}")


    
    