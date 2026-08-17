package com.wexa.skillgraph.model;

import java.util.List;

public record RelatedCandidate(Candidate candidate, int sharedSkillCount, List<String> sharedSkills) {}
