package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.model.Candidate;
import com.wexa.skillgraph.service.GraphService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final GraphService service;

    public CandidateController(GraphService service) {
        this.service = service;
    }

    @GetMapping
    public List<Candidate> list() {
        return service.listCandidates();
    }

    @GetMapping("/{id}")
    public Map<String, Object> profile(@PathVariable String id) {
        return service.getCandidateProfile(id);
    }
}
