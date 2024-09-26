package com.ssafy.stackup.domain.framework.service;

import com.ssafy.stackup.common.exception.ResourceNotFoundException;
import com.ssafy.stackup.domain.board.repository.BoardRepository;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.framework.dto.FrameworkResponse;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.framework.repository.FrameworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FrameworkService {
    private final FrameworkRepository frameworkRepository;
    private final BoardRepository boardRepository;

    @Transactional(readOnly = true)
    public List<Framework> findAllFrameworks() {
        return frameworkRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Framework findFrameworkById(Long id) {
        return frameworkRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("해당 프레임워크 존재하지 않음"));
    }

    @Transactional(readOnly = true)
    public List<Framework> findFrameworkByBoardId(Long boardId) {
        return boardRepository.findFrameworksByBoardId(boardId);
    }

    public FrameworkResponse createFramework(FrameworkRequest frameworkRequest) {
        Framework framework = Framework.builder()
                .name(frameworkRequest.getName())
                .build();
        frameworkRepository.save(framework);
        return new FrameworkResponse(framework.getId(), framework.getName());
    }



}
