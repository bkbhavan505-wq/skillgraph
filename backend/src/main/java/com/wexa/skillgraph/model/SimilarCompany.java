package com.wexa.skillgraph.model;

import java.util.List;

public record SimilarCompany(Company company, int sharedSkillCount, List<String> sharedSkills) {}
