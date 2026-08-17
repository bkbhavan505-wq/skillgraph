package com.wexa.skillgraph.model;

import java.util.List;

/** Result of matching a candidate against a job: how many required skills overlap, and which ones are missing. */
public record JobMatch(
        Job job,
        int matchedSkillCount,
        int requiredSkillCount,
        List<String> matchedSkills,
        List<String> missingSkills
) {}
