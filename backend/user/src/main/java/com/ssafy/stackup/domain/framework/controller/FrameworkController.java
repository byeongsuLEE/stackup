package com.ssafy.stackup.domain.framework.controller;

import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.framework.dto.FrameworkResponse;
import com.ssafy.stackup.domain.framework.entity.Framework;
import com.ssafy.stackup.domain.framework.service.FrameworkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("user/frameworks")
public class FrameworkController {

    private final FrameworkService frameworkService;

    @GetMapping
    public ResponseEntity<?> findAllFrameworks() {
        List<Framework> frameworks = frameworkService.findAllFrameworks();

        List<FrameworkRequest> frameworkRequests = frameworks.stream()
                .map(FrameworkRequest::new)
                .collect(Collectors.toList());

    return ResponseEntity.ok(frameworkRequests);}

    @GetMapping("/{frameworkId}")
    public ResponseEntity<?> findFrameworkById(@PathVariable Long frameworkId) {
        Framework framework = frameworkService.findFrameworkById(frameworkId);
        FrameworkRequest frameworkRequest = new FrameworkRequest(framework);
        return ResponseEntity.ok(frameworkRequest);
    }

    @PostMapping
    public ResponseEntity<?> createFramework(@RequestBody FrameworkRequest request) {

        FrameworkResponse frameworkResponse = frameworkService.createFramework(request);

        return ResponseEntity.ok(frameworkResponse);
    }
}
