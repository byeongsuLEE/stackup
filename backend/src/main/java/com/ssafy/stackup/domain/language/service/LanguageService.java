package com.ssafy.stackup.domain.language.service;

import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import com.ssafy.stackup.domain.language.dto.LanguageResponse;
import com.ssafy.stackup.domain.language.entity.Language;
import com.ssafy.stackup.domain.language.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LanguageService {
    private final LanguageRepository languageRepository;
    private final BoardRepository boardRepository;

    @Transactional(readOnly = true)
    public List<Language> findAllLanguages() {
        return languageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Language findLanguageById(Long id) {
        return languageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("해당 언어 존재하지 않음"));
    }

    @Transactional(readOnly = true)
    public List<Language> findLanguagesByBoardId(Long boardId) {
        return boardRepository.findLanguagesByBoardId(boardId);
    }

    public LanguageResponse createLanguage(LanguageRequest languageRequest) {
        Language language = Language.builder()
                .name(languageRequest.getName())
                .build();
        languageRepository.save(language);
        return new LanguageResponse(language.getId(), language.getName());
    }
}
