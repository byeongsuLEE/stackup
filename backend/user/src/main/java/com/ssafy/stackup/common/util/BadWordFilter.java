package com.ssafy.stackup.common.util;

import java.util.Arrays;
import java.util.List;


public class BadWordFilter {
    private  static final List<String> BadWordList = Arrays.asList(
            "바보", "멍청이", "얼간이", "찌질이", "등신",
            "놈", "새끼", "개자식", "미친놈", "돌아이",
            "쓰레기", "개같은", "죽어", "닥쳐", "엿먹어",
            "미친", "잡놈", "눈깔", "쌍놈", "돌대가리",
            "씨발", "좆", "병신", "씹새끼", "개새끼",
            "좆같다", "존나", "썅", "개같은", "미친년",
            "빨갱이", "걸레", "쳐죽일", "애미", "니미",
            "좆까", "씹할", "썩을", "쳐먹어", "죽일놈"
    );

    public boolean containsBadWords(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }

        // 입력 문자열을 소문자로 변환하여 비속어 목록과 대조
        String lowerCaseInput = input.toLowerCase();

        // 비속어 목록 중 하나라도 포함되어 있는지 확인
        return BadWordList.stream().anyMatch(lowerCaseInput::contains);
    }


}
