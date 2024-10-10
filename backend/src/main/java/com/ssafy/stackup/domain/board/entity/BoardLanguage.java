package com.ssafy.stackup.domain.board.entity;

import com.ssafy.stackup.domain.language.entity.Language;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_language")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_language_id")
    private Long boardLanguageId;

    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;
}
