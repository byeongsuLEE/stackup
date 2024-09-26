import time
import json
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Chrome 옵션 설정
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # 브라우저 창을 띄우지 않고 크롤링 (헤드리스 모드)
options.add_argument('--no-sandbox')  # 샌드박스 모드 비활성화
options.add_argument('--disable-dev-shm-usage')  # /dev/shm 사용 비활성화
options.add_argument('--disable-gpu')  # GPU 가속 비활성화
options.add_argument('--remote-debugging-port=9222')  # 디버깅 포트 설정

# 웹 드라이버 초기화
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# URL로 이동
url = "https://www.wishket.com/project/#clear"
driver.get(url)

# 요소 로드 대기
wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.container.project-list-view")))

print("페이지 로드 완료")

# 크롤링할 데이터 저장을 위한 리스트
projects = []

# 최대 페이지 수 설정
max_pages = 1000
current_page = 1

# 페이지네이션 처리 및 데이터 크롤링
while current_page <= max_pages:
    # 현재 페이지의 HTML 소스를 가져오기
    time.sleep(3)  # 페이지가 로드될 시간을 기다림
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # 프로젝트 정보가 담긴 섹션을 모두 찾기
    project_sections = soup.find_all('section', class_='project-organic-info')

    # 각 프로젝트에서 필요한 정보 추출
    for section in project_sections:
        try:
            project_title = section.find('a', class_='subtitle-2-medium project-link').find('p', class_='subtitle-1-half-medium').text.strip()
        except AttributeError:
            project_title = None
        
        try:
            budget_info = section.find('div', class_='project-core-info mb10')
            project_type = budget_info.find('p', class_='budget body-1 text700').text.strip()
            project_budget = budget_info.find('span', class_='body-1-medium').text.strip()
            project_duration = budget_info.find('p', class_='term body-1 text700').find('span', class_='body-1-medium').text.strip()
        except AttributeError:
            project_type, project_budget, project_duration = None, None, None
        
        try:
            category_info = section.find('div', class_='project-classification-info mb32')
            project_category = category_info.find('p', class_='project-category-or-role body-2 text700').text.strip()
            project_level = category_info.find('p', class_='project-level body-2 text700').text.strip()
        except AttributeError:
            project_category, project_level = None, None

        try:
            skills = [skill.text.strip() for skill in section.find('div', class_='project-skills-info').find_all('span', class_='skill-chip body-3 text600')]
        except AttributeError:
            skills = []

        try:
            location = section.find('p', class_='body-3 text500 location-data').text.strip()
        except AttributeError:
            location = None

        # 프로젝트 정보를 딕셔너리로 저장
        project_data = {
            '프로젝트 제목': project_title,
            '타입': project_type,
            '금액': project_budget,
            '기간': project_duration,
            '유형': project_category,
            '레벨': project_level,
            '기술들': skills,
            '위치': location
        }

        # 리스트에 추가
        projects.append(project_data)

    print(f"{current_page} 페이지 크롤링 완료, {len(project_sections)}개의 프로젝트 수집")

    # 다음 페이지로 이동하는 버튼 찾기
    try:
        next_button = driver.find_element(By.XPATH, "//li[@class='page-item']/a[contains(text(), '다음')]")
        if "disabled" in next_button.get_attribute("class"):
            print("다음 페이지가 없습니다. 크롤링을 종료합니다.")
            break  # 다음 버튼이 비활성화되어 있으면 종료
        next_button.click()
        current_page += 1
    except Exception as e:
        print(f"다음 페이지로 이동할 수 없습니다: {e}")
        break

# 드라이버 종료
driver.quit()

# 데이터를 CSV 파일로 저장
df = pd.DataFrame(projects)
df.to_csv('wishket_projects.csv', index=False, encoding='utf-8-sig')
print("CSV 파일로 저장 완료: wishket_projects.csv")

# 데이터를 JSON 파일로 저장
with open('wishket_projects.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=4)
print("JSON 파일로 저장 완료: wishket_projects.json")
