from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

url = 'https://apps2.campusrec.illinois.edu/checkins/live'

options = webdriver.ChromeOptions()
# Uncomment below if you want to run Chrome in headless mode
# options.add_argument('headless')

browser = webdriver.Chrome(options=options)  # Add path like this if needed: webdriver.Chrome('path_to_chromedriver', options=options)
browser.get(url)

# List of XPaths you want to extract text from
xpaths = [
    '/html/body/div/div/div[2]/div[1]/div/div[2]',
    '/html/body/div/div/div[2]/div[2]',
    '/html/body/div/div/div[2]/div[3]',
    '/html/body/div/div/div[2]/div[4]',
    '/html/body/div/div/div[2]/div[5]',
    '/html/body/div/div/div[2]/div[6]',
    '/html/body/div/div/div[2]/div[7]',
    '/html/body/div/div/div[2]/div[8]',
    '/html/body/div/div/div[2]/div[9]',
    '/html/body/div/div/div[2]/div[10]',
    '/html/body/div/div/div[2]/div[11]',
    '/html/body/div/div/div[2]/div[12]',
    '/html/body/div/div/div[2]/div[13]',
    '/html/body/div/div/div[2]/div[14]',
    '/html/body/div/div/div[2]/div[15]',
    '/html/body/div/div/div[2]/div[16]',
    '/html/body/div/div/div[2]/div[17]',
    '/html/body/div/div/div[2]/div[18]',
    '/html/body/div/div/div[2]/div[19]',
  

]

for path in xpaths:
    try:
        # Wait up to 10 seconds for each element to be present
        element = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.XPATH, path))
        )
        print(element.text)
    except:
        print(f"Couldn't find element with XPath: {path}")

browser.quit()


#driver = webdriver.Chrome()
#driver.get('https://apps2.campusrec.illinois.edu/checkins/live')

#rooms = driver.find_elements("xpath",'//*[@id="app"]/div/div[2]/div[9]/div/div[2]')

#for room in rooms:
 #   title = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/b').text
 #   count = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/br[2]').text
  #  updated = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/br[3]').text
  #  print(title, count, updated)

#driver.quit()
#def get_data(url):
 #   browser_options = ChromeOptions()
 #   browser_options.headless = True

 #   driver = Chrome(options=browser_options)
  #  driver.get(url)

  #  elements = driver.find_elements(By.NAME("room-description"))
    
    # Collect the data from the found elements
  #  data = [element.text("<b data-v-ac6ff1de") for element in elements]

  #  driver.quit()

  #  return data

#def main(): 
 #   data = get_data("https://apps2.campusrec.illinois.edu/checkins/live")
  #  print(data)

#if __name__ == "__main__":
 #   main()






#driver = webdriver.Chrome()
#driver.get("https://apps2.campusrec.illinois.edu/checkins/live")
#driver.implicity_wait(10)
#page_source = driver.page_source
#driver.quit()
#soup = BeautifulSoup(page_source, "hmtl.parser")


#req = requests.get("https://apps2.campusrec.illinois.edu/checkins/live")

#soup = BeautifulSoup(req.content, "html.parser")
#x = soup.find('div', class_= "room-description")
#x = soup.find_all('div')
#print(soup.prettify())
#print(x)