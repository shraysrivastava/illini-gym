
# scraper.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
import firebase_admin
from firebase_admin import credentials, firestore
from faker import Faker
import random
import datetime

# Initialize Firebase Admin
cred = credentials.Certificate("/Users/taiguewoods/Desktop/CS 222/group-project-team70/backend/illini-gymv2-firebase-adminsdk-q06e1-e91944c6ea.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def scrape_and_update():
    url = 'https://apps2.campusrec.illinois.edu/checkins/live'
    options = webdriver.ChromeOptions()
    options.add_argument('headless')  # Run Chrome in headless mode
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
    ]

    data_ = {}
    # Your scraping logic goes here
    # ...
    for path in xpaths:
        try:
            element = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.XPATH, path))
            )
            text = element.text.split('\n')

        # Extract the relevant data from the text list
            room_name = text[0].strip().lower().replace(" ", "-") if len(text) > 0 else None
            status = text[1].strip("()") if len(text) > 1 else None
            last_count_data = text[2].split(' ') if len(text) > 2 else None
            last_count = last_count_data[2] if last_count_data and len(last_count_data) > 2 else None
            capacity = last_count_data[4] if last_count_data and len(last_count_data) > 4 else None  # Extracting capacity
            last_updated = text[3].strip() if len(text) > 3 else None
        
        # Normalize the status to a boolean value
            is_open = True if status.lower() == "open" else False

            if room_name:
                data_[room_name] = {
                    "name": room_name.replace("-", " ").title(),  # Convert back to title case for the name field
                    "count": int(last_count),
                    "capacity": int(capacity),  # Added capacity
                    "isOpen": is_open,
                    "lastUpdated": last_updated  # This should now hold the correct date and time
                }
            print(f"Room Name: {room_name}")
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
    collection_id_one = "arc"
    for room_name, room_data in data_.items():
        doc_ref = db.collection(collection_id_one).document(room_name)
        doc_ref.set(room_data, merge=True)  # Use set with merge=True to create or update
    
#scrape_and_update() only used to test output of this
def generate_fake_data_cerce(faker, num_entries=10):
    fake_data = {}
    gym_room_names = ["Cardio Zone", "Strength Training", "Yoga Studio", "Cycling Room", "Aquatics Center", "Functional Fitness", "Dance Hall", "Pilates Studio", "Crossfit Area", "Free Weights Zone"]
    for name in gym_room_names:
        room_name = name.title()  # Generates a random word as the room name
        fake_entry = {
            "name": room_name.replace("-", " ").title(),  # Convert back to title case for the name field
            "count": faker.random_int(min=0, max=100),  # Random count between 0 and 100
            "capacity": faker.random_int(min=100, max=200),  # Random capacity between 100 and 200
            "isOpen": faker.boolean(),  # Randomly True or False
            "lastUpdated": faker.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')  # Random datetime from this year
        }
        fake_data[room_name] = fake_entry  # This line should be inside the loop
        print(f"Room Name: {room_name}")

    return fake_data

def scrape_and_update_cerce():

    faker = Faker()
    fake_data = generate_fake_data_cerce(faker, num_entries=20)  # Generates 20 fake entries

    # Update Firestore with fake data
    fake_collection_id = "cerce"
    for room_name, room_data in fake_data.items():
        doc_ref = db.collection(fake_collection_id).document(room_name)
        doc_ref.set(room_data, merge=True)  # Create or update document

