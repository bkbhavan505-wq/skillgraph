package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.model.Skill;
import com.wexa.skillgraph.model.SkillPath;
import com.wexa.skillgraph.service.GraphService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final GraphService service;

    public SkillController(GraphService service) {
        this.service = service;
    }

    @GetMapping
    public List<Skill> list() {
        return service.listSkills();
    }

    @GetMapping("/{name}/related")
    public List<Skill> related(@PathVariable String name) {
        return service.relatedSkills(name);
    }

    @GetMapping("/path")
    public SkillPath path(@RequestParam String from, @RequestParam String to) {
        return service.skillPath(from, to);
    }
}
