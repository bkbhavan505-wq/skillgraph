package com.wexa.skillgraph.model;

import java.util.List;

/** A chain of related skills connecting two skills, e.g. Docker -> Kubernetes -> AWS -> Java. */
public record SkillPath(List<String> skillNames, int hops) {}
