import requests
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# SBERT 모델 로드
model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

# Spring Boot 서버로부터 Board 데이터 가져오기
def get_boards_from_spring():
    response = requests.get("http://localhost:8081/api/board/search-all")
    return response.json()

@app.route('/similar_boards', methods=['POST'])
def find_similar_boards():
    data = request.json
    query_description = data['description']

    # Spring Boot 서버에서 모든 Board 데이터 가져오기
    board_data = get_boards_from_spring()

    # print(board_data['data'])

    # 모든 게시글의 description 임베딩
    board_descriptions = [board['description'] for board in board_data['data']]
    board_embeddings = model.encode(board_descriptions, convert_to_tensor=True)

    # 쿼리 description 임베딩
    query_embedding = model.encode(query_description, convert_to_tensor=True)

    # 코사인 유사도 계산
    cosine_scores = util.pytorch_cos_sim(query_embedding, board_embeddings).cpu().numpy()

    # # 유사도가 높은 순으로 정렬하여 상위 3개 게시글 선택
    # similar_indices = cosine_scores.argsort()[0][::-1][:3]
    # 유사도가 높은 순으로 정렬하여 상위 1개 게시글 선택
    similar_indices = cosine_scores.argsort()[0][::-1][0] 
    print(similar_indices)
    # similar_boards = [board_data['data'][i] for i in similar_indices]
    similar_board = board_data['data'][similar_indices]
    print(similar_board)

    return jsonify(similar_board)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
