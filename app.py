import os
import importlib
from flask import Flask

app = Flask(__name__)

# ml 폴더 내의 모든 .py 파일을 동적으로 임포트
ml_path = os.path.join(os.path.dirname(__file__), 'ml')
for filename in os.listdir(ml_path):
    if filename.endswith('.py'):
        module_name = f"ml.{filename[:-3]}"  # .py 확장자 제거
        importlib.import_module(module_name)

@app.route('/flask')
def hello():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
