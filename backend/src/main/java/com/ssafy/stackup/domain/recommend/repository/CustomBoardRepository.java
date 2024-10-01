package com.ssafy.stackup.domain.recommend.repository;

import com.ssafy.stackup.domain.recommend.entity.Recommend;

import java.util.List;

public interface CustomBoardRepository {
    List<Recommend> searchByEmbedding(List<Float> embedding);
}
