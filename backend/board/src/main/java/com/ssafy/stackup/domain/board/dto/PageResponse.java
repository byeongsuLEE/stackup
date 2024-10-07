package com.ssafy.stackup.domain.board.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageResponse {
    private int totalPages;
    private long totalElements;
    private long size;
    private List<?> content;

    public PageResponse() {};

    public PageResponse(Page<?> page) {
        this.totalPages = page.getTotalPages();
        this.totalElements = page.getTotalElements();
        this.size = page.getSize();
        this.content = page.getContent();
    }
}
