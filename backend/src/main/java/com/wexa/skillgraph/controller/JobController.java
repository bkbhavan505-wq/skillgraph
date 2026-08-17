package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.model.Job;
import com.wexa.skillgraph.service.GraphService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final GraphService service;

    public JobController(GraphService service) {
        this.service = service;
    }

    @GetMapping
    public List<Job> list() {
        return service.listJobs();
    }

    @GetMapping("/{id}")
    public Map<String, Object> profile(@PathVariable String id) {
        return service.getJobProfile(id);
    }
}
