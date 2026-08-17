package com.wexa.skillgraph.model;

public record SkillRequirement(String skillName, int minProficiency, boolean mandatory) {}
