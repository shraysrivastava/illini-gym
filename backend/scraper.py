from selenium import webdriver



driver = webdriver.Chrome()
driver.get('https://apps2.campusrec.illinois.edu/checkins/live')

rooms = driver.find_elements("xpath",'//*[@id="app"]/div/div[2]/div[9]/div/div[2]')

for room in rooms:
    title = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/b').text
    count = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/br[2]').text
    updated = room.find_element("xpath",'.//*[@id="app"]/div/div[2]/div[9]/div/div[2]/br[3]').text
    print(title, count, updated)

driver.quit()
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