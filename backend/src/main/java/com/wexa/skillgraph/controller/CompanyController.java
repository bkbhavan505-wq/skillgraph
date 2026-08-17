package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.model.Company;
import com.wexa.skillgraph.service.GraphService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final GraphService service;

    public CompanyController(GraphService service) {
        this.service = service;
    }

    @GetMapping
    public List<Company> list() {
        return service.listCompanies();
    }
}
