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

        # Basic checks to ensure we're not going out of index
        room_name = text[0] if len(text) > 0 else None
        status = text[1].strip("()") if len(text) > 1 else None
        last_count = text[2].split(': ')[1] if len(text) > 2 else None
        date_time = text[3] if len(text) > 3 else None
        
        if room_name:
            data_[room_name] = {
                "Status": status,
                "Last Count": last_count,
                "Date and Time": date_time
            }
            print(data_[room_name])

    except Exception as e:
        print(f"Error with XPath: {path}. Error details: {e}")

browser.quit()

for room_name in data_ :
    print(room_name)


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime 
from datetime import datetime
import pytz

tz = pytz.timezone("America/Chicago")
time = datetime.now(tz).strftime('%Y-%m-%d %H:%M:%S')
cred = credentials.Certificate("/Users/taiguewoods/Desktop/CS 222/group-project-team70/backend/illini-gym-firebase-adminsdk-8p8no-a3ec2d6860.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


def save(collection_id, document_id, data_):
    db.collection(collection_id).document(document_id).set(data_)
    
save(collection_id="Gym Counts", document_id=f"{time}", data_=data_)