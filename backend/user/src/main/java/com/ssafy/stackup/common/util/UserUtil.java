package com.ssafy.stackup.common.util;

import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.user.entity.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserUtil {

    public static String checkUserType(User user){
        if(user instanceof Freelancer){
            return "Freelancer";
        }else {
            return "Client";
        }
    }

    public static List<String> getFrameworks(Set<FreelancerFramework> frameworks){
        return frameworks.stream()
                .map(freelancerFramework -> freelancerFramework.getFramework().getName())
                .collect(Collectors.toList());
    }

    public static List<String> getLanguages(Set<FreelancerLanguage> languages){
        return languages.stream()
                .map(freelancerLanguages -> freelancerLanguages.getLanguage().getName())
                .collect(Collectors.toList());
    }

    public static List<Project> getProjects(Set<FreelancerProject> projects){
        return projects.stream()
                .map(freelancerProjects -> freelancerProjects.getProject())
                .collect(Collectors.toList());
    }

    public static List<String> getBoardFrameworks(List<BoardFramework> frameworks){
        return frameworks.stream()
                .map(freelancerFramework -> freelancerFramework.getFramework().getName())
                .collect(Collectors.toList());
    }

    public static List<String> getBoardLanguages(List<BoardLanguage> languages){
        return languages.stream()
                .map(freelancerFramework -> freelancerFramework.getLanguage().getName())
                .collect(Collectors.toList());
    }

}
