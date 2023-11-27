from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

url = 'https://apps2.campusrec.illinois.edu/checkins/live'

options = webdriver.ChromeOptions()
# Uncomment below if you want to run Chrome in headless mode
# options.add_argument('headless')

browser = webdriver.Chrome(options=options)
browser.get(url)

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
]

data_ = {}

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

    except Exception as e:
        print(f"Error with XPath: {path}. Error details: {e}")

browser.quit()

# Print the parsed data
for room_name, room_data in data_.items():
    print(f"Room Name: {room_name}")
    print(f"Status: {room_data['isOpen']}")
    print(f"Count: {room_data['count']}")
    print(f"Capacity: {room_data['capacity']}")
    print(f"Last Updated: {room_data['lastUpdated']}\n")



import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime 
from datetime import datetime
import pytz

cred = credentials.Certificate("/Users/taiguewoods/Desktop/CS 222/group-project-team70/backend/illini-gymv2-firebase-adminsdk-q06e1-e91944c6ea.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


#def save(collection_id, document_id, data_):
    #db.collection(collection_id).document(document_id).set(data_)
    
#save(collection_id="Gym Counts", document_id=f"{time}", data_=data_) #change
def update_rooms_data(collection_id, data):
    for room_name, room_data in data.items():
        # Create a reference to the document we want to update
        room_ref = db.collection(collection_id).document(room_name)
        
        # Prepare the data for update (assuming data_ structure is correct)
        update_data = {
            'capacity': room_data.get('capacity'),  # assuming 'capacity' is in the data
            'count': room_data.get('count'),
            'isOpen': room_data.get('isOpen'),
            'lastUpdated': room_data.get('lastUpdated'),
            'name': room_data.get('name')  # assuming 'name' is in the data
        }
        
        # Update the document, remove None values from update_data
        room_ref.update({k: v for k, v in update_data.items() if v is not None})

collection_id = "arc-test"
update_rooms_data(collection_id, data_)

