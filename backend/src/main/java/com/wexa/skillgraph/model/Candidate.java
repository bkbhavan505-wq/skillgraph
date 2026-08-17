package com.wexa.skillgraph.model;

public record Candidate(
        String id,
        String name,
        String email,
        String location,
        Integer experienceYears,
        String bio
) {}
