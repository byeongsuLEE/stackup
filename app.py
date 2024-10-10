from flask import Flask
from ml import sbert
from ml import server

app = Flask(__name__)

@app.route('/flask')
def hello():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
