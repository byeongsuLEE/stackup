//package com.ssafy.stackup.domain.recommend.service;
//import co.elastic.clients.elasticsearch._types.query_dsl.ScriptScoreQuery;
//import com.ssafy.stackup.domain.recommend.entity.Recommend;
//import com.ssafy.stackup.domain.recommend.repository.CustomBoardRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.elasticsearch.client.elc.NativeQuery;
//import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
//import org.springframework.data.elasticsearch.core.query.ScriptType;
//import org.springframework.data.elasticsearch.core.script.Script;
//import org.springframework.stereotype.Component;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Component
//public class CustomBoardRepositoryImpl implements CustomBoardRepository {
//
//    private final ElasticsearchOperations elasticsearchOperations;
//
//    @Autowired
//    public CustomBoardRepositoryImpl(ElasticsearchOperations elasticsearchOperations) {
//        this.elasticsearchOperations = elasticsearchOperations;
//    }
//
//    @Override
//    public List<Recommend> searchByEmbedding(List<Float> embedding) {
//        // Elasticsearch에서 벡터 검색을 수행하는 스크립트
//        Map<String, Object> params = new HashMap<>();
//        params.put("embedding", embedding);
//
//        // Elasticsearch의 painless script로 벡터 간 유사도를 계산하는 스크립트
//        String script = "cosineSimilarity(params.embedding, 'descriptionVector') + 1.0";
//        // ScriptScoreQuery 생성
//        ScriptScoreQuery scriptScoreQuery = new ScriptScoreQuery(
//                QueryBuilders.matchAllQuery(),
//                new Script(ScriptType.INLINE, "painless", script, params)
//        );
//
//        // NativeQuery를 생성하여 스크립트 기반 검색 수행
//        NativeQuery searchQuery = NativeQuery.builder()
//                .withQuery(scriptScoreQueryBuilder)
//                .build();
//
//        // Elasticsearch로 쿼리를 실행하고 결과를 반환
//        SearchHits<Board> searchHits = elasticsearchRestTemplate.search(searchQuery, Board.class);
//
//        // 유사한 게시물 리스트 반환
//        return searchHits.getSearchHits().stream()
//                .map(hit -> hit.getContent())
//                .toList();
//    }
//}
