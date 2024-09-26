package com.ssafy.stackup.domain.evaluation.repository;

import com.ssafy.stackup.domain.evaluation.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-24
 * 설명    :
 */
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
}
