package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.model.Company;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CompanyRepository {

    private final GraphExecutor db;

    public CompanyRepository(GraphExecutor db) {
        this.db = db;
    }

    public List<Company> findAll() {
        String cypher = "MATCH (c:Company) RETURN c.name AS name, c.industry AS industry, c.location AS location ORDER BY c.name";
        return db.readList(cypher, Map.of(), this::mapCompany);
    }

    /**
     * Companies whose job postings demand a similar skill set to the given company --
     * a 4-hop traversal: (Company)<-[:POSTED_BY]-(Job)-[:REQUIRES_SKILL]->(Skill)
     * <-[:REQUIRES_SKILL]-(Job)-[:POSTED_BY]->(Company). Doing this in SQL means a
     * job-requirements table self-joined through a skills bridge table twice --
     * workable, but the query plan and the SQL itself both get hard to read fast.
     */
    public List<Map<String, Object>> findSimilarCompanies(String companyName, int limit) {
        String cypher = """
            MATCH (me:Company {name: $name})<-[:POSTED_BY]-(:Job)-[:REQUIRES_SKILL]->(s:Skill)
                  <-[:REQUIRES_SKILL]-(:Job)-[:POSTED_BY]->(other:Company)
            WHERE other.name <> $name
            WITH other, collect(DISTINCT s.name) AS sharedSkills
            RETURN other.name AS name, other.industry AS industry, other.location AS location,
                   size(sharedSkills) AS sharedCount, sharedSkills
            ORDER BY sharedCount DESC
            LIMIT $limit
            """;
        return db.readList(cypher, Map.of("name", companyName, "limit", limit), rec -> Map.of(
                "company", mapCompany(rec),
                "sharedSkillCount", rec.get("sharedCount").asInt(),
                "sharedSkills", rec.get("sharedSkills").asList(v -> v.asString())
        ));
    }

    private Company mapCompany(org.neo4j.driver.Record rec) {
        return new Company(rec.get("name").asString(), rec.get("industry").asString(), rec.get("location").asString());
    }
}
