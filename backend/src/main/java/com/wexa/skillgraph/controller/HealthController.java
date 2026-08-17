package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.repository.GraphExecutor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Lightweight custom health check that actually pings CognoDB, on top of Actuator's /actuator/health. */
@RestController
public class HealthController {

    private final GraphExecutor db;

    public HealthController(GraphExecutor db) {
        this.db = db;
    }

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        boolean up = db.ping();
        return Map.of("status", up ? "UP" : "DOWN", "database", up ? "reachable" : "unreachable");
    }
}
