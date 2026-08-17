package com.wexa.skillgraph.model;

import java.util.List;

public record CandidateMatch(
        Candidate candidate,
        int matchedSkillCount,
        int requiredSkillCount,
        List<String> matchedSkills,
        List<String> missingSkills
) {}
