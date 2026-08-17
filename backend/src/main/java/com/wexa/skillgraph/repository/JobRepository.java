package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.model.Job;
import com.wexa.skillgraph.model.SkillRequirement;
import org.neo4j.driver.Record;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JobRepository {

    private final GraphExecutor db;

    public JobRepository(GraphExecutor db) {
        this.db = db;
    }

    public List<Job> findAll() {
        String cypher = """
            MATCH (j:Job)-[:POSTED_BY]->(co:Company)
            RETURN j.id AS id, j.title AS title, j.description AS description, j.location AS location,
                   j.employmentType AS employmentType, j.minExperience AS minExperience,
                   j.postedDate AS postedDate, co.name AS companyName
            ORDER BY j.postedDate DESC
            """;
        return db.readList(cypher, Map.of(), this::mapJob);
    }

    public Optional<Job> findById(String id) {
        String cypher = """
            MATCH (j:Job {id: $id})-[:POSTED_BY]->(co:Company)
            RETURN j.id AS id, j.title AS title, j.description AS description, j.location AS location,
                   j.employmentType AS employmentType, j.minExperience AS minExperience,
                   j.postedDate AS postedDate, co.name AS companyName
            """;
        return db.readOne(cypher, Map.of("id", id), this::mapJob);
    }

    public List<SkillRequirement> findRequirements(String jobId) {
        String cypher = """
            MATCH (j:Job {id: $id})-[r:REQUIRES_SKILL]->(s:Skill)
            RETURN s.name AS skillName, r.minProficiency AS minProficiency, r.mandatory AS mandatory
            ORDER BY r.mandatory DESC, s.name
            """;
        return db.readList(cypher, Map.of("id", jobId), rec -> new SkillRequirement(
                rec.get("skillName").asString(),
                rec.get("minProficiency").asInt(),
                rec.get("mandatory").asBoolean()
        ));
    }

    private Job mapJob(Record rec) {
        return new Job(
                rec.get("id").asString(),
                rec.get("title").asString(),
                rec.get("description").asString(""),
                rec.get("location").asString(),
                rec.get("employmentType").asString(),
                rec.get("minExperience").asInt(0),
                rec.get("postedDate").asString(),
                rec.get("companyName").asString()
        );
    }
}
