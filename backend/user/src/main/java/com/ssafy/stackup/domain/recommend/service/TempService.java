package com.ssafy.stackup.domain.recommend.service;

public class TempService {

    public String preprocessText(String input) {
        // 소문자 변환
        String lowerCaseText = input.toLowerCase();
        // 특수 문자 제거
        String cleanText = lowerCaseText.replaceAll("[^a-zA-Z0-9가-힣\\s]", "");
        // 불용어 제거 로직 추가 (예: 외부 라이브러리 사용)
        // 형태소 분석 로직 추가 (예: 외부 라이브러리 사용)

        return cleanText;
    }

    public double cosineSimilarity(double[] vectorA, double[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }

        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

}
