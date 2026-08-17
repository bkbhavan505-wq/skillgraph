package com.wexa.skillgraph.model;

public record Job(
        String id,
        String title,
        String description,
        String location,
        String employmentType,
        Integer minExperience,
        String postedDate,
        String companyName
) {}
