package com.ssafy.stackup.domain.recommend.repository;

import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.recommend.entity.Recommend;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository("boardElasticsearchRepo")
//@Component
public interface BoardElasticsearchRepository extends ElasticsearchRepository<Recommend, String> {
    List<Recommend> findByClassification(String classification);

    //언어에 따른 검색
//    @Query("{\"nested\": {\"path\": \"languages.language\", \"query\": {\"terms\": {\"languages.language.name\": ?0}}}}")
    List<Recommend> findByLanguages(String language);

    //프레임워크에 따른 검색
    List<Recommend> findByFrameworks(String framework);

    // 검색 조건으로 경력 연수 (careerYear)을 기준으로 프리랜서에게 적합한 board 목록을 찾는 메서드
    List<Recommend> findByLevel(Level level);

    List<Recommend> findByDescriptionLike(String description);

    // Fuzzy matching을 사용하는 쿼리 메서드
    List<Recommend> findByDescriptionContaining(String description);

    // Fuzzy matching 쿼리
//    @Query("{\"match\": {\"description\": {\"query\": ?0, \"fuzziness\": \"AUTO\"}}}")
//    List<Recommend> fuzzyFindByDescription(String description);

//    List<Recommend> findByDescriptionVector(double[] vector);

    @Query("""
    {
      "bool": {
        "must": [
                          { "match": { "classification": "?0" } },
                          { "nested": {
                              "path": "languages",
                              "query": {
                                "bool": {
                                  "should": [
                                    { "match": { "languages.language.name": "?1" } }
                                  ]
                                }
                              }
                            }
                          },
                          { "nested": {
                              "path": "frameworks",
                              "query": {
                                "bool": {
                                  "should": [
                                    { "match": { "frameworks.framework.name": "?2" } }
                                  ]
                                }
                              }
                            }
                          },
          { "match": { "level": "?3" } }
        ]
      }
    }
    """)
    List<Recommend> findByMultipleCriteria(String classification, Set<String> languages, Set<String> frameworks, Level level);

}
