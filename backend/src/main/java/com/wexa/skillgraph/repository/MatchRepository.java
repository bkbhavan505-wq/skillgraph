package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.model.Job;
import com.wexa.skillgraph.model.JobMatch;
import com.wexa.skillgraph.model.Candidate;
import com.wexa.skillgraph.model.CandidateMatch;
import org.neo4j.driver.Record;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Cross-entity matching queries -- the heart of why this app is a graph, not a
 * spreadsheet. Every query here is a multi-hop traversal that would need several
 * self-joins and app-side post-processing in a relational schema; here it's one
 * Cypher statement each, parameterised, no APOC required.
 */
@Repository
public class MatchRepository {

    private final GraphExecutor db;

    public MatchRepository(GraphExecutor db) {
        this.db = db;
    }

    /**
     * For a candidate, rank every job by how many of its required skills the
     * candidate already has, and list exactly which required skills are missing.
     * 2-hop: (Candidate)-[:HAS_SKILL]->(Skill)<-[:REQUIRES_SKILL]-(Job).
     */
    public List<JobMatch> jobsForCandidate(String candidateId, int limit) {
        String cypher = """
            MATCH (c:Candidate {id: $id})
            MATCH (j:Job)-[:REQUIRES_SKILL]->(reqSkill:Skill)
            MATCH (j)-[:POSTED_BY]->(co:Company)
            WITH c, j, co, collect(DISTINCT reqSkill.name) AS allRequired
            OPTIONAL MATCH (c)-[:HAS_SKILL]->(matchedSkill:Skill)<-[:REQUIRES_SKILL]-(j)
            WITH c, j, co, allRequired, collect(DISTINCT matchedSkill.name) AS matched
            WHERE size(matched) > 0
            RETURN j.id AS id, j.title AS title, j.description AS description, j.location AS location,
                   j.employmentType AS employmentType, j.minExperience AS minExperience,
                   j.postedDate AS postedDate, co.name AS companyName,
                   size(matched) AS matchedCount, size(allRequired) AS requiredCount,
                   matched, [s IN allRequired WHERE NOT s IN matched] AS missing
            ORDER BY matchedCount DESC, requiredCount ASC
            LIMIT $limit
            """;
        return db.readList(cypher, Map.of("id", candidateId, "limit", limit), this::mapJobMatch);
    }

    /**
     * The mirror query: for a job, rank every candidate by how many required
     * skills they already have, surfacing near-misses (skill-gap candidates)
     * as well as full matches.
     */
    public List<CandidateMatch> candidatesForJob(String jobId, int limit) {
        String cypher = """
            MATCH (j:Job {id: $id})-[:REQUIRES_SKILL]->(reqSkill:Skill)
            WITH j, collect(DISTINCT reqSkill.name) AS allRequired
            MATCH (c:Candidate)-[:HAS_SKILL]->(matchedSkill:Skill)<-[:REQUIRES_SKILL]-(j)
            WITH c, allRequired, collect(DISTINCT matchedSkill.name) AS matched
            RETURN c.id AS id, c.name AS name, c.email AS email, c.location AS location,
                   c.experienceYears AS experienceYears, c.bio AS bio,
                   size(matched) AS matchedCount, size(allRequired) AS requiredCount,
                   matched, [s IN allRequired WHERE NOT s IN matched] AS missing
            ORDER BY matchedCount DESC, requiredCount ASC
            LIMIT $limit
            """;
        return db.readList(cypher, Map.of("id", jobId, "limit", limit), this::mapCandidateMatch);
    }

    private JobMatch mapJobMatch(Record rec) {
        Job job = new Job(
                rec.get("id").asString(), rec.get("title").asString(), rec.get("description").asString(""),
                rec.get("location").asString(), rec.get("employmentType").asString(),
                rec.get("minExperience").asInt(0), rec.get("postedDate").asString(), rec.get("companyName").asString()
        );
        return new JobMatch(
                job, rec.get("matchedCount").asInt(), rec.get("requiredCount").asInt(),
                rec.get("matched").asList(v -> v.asString()), rec.get("missing").asList(v -> v.asString())
        );
    }

    private CandidateMatch mapCandidateMatch(Record rec) {
        Candidate candidate = new Candidate(
                rec.get("id").asString(), rec.get("name").asString(), rec.get("email").asString(),
                rec.get("location").asString(), rec.get("experienceYears").asInt(0), rec.get("bio").asString("")
        );
        return new CandidateMatch(
                candidate, rec.get("matchedCount").asInt(), rec.get("requiredCount").asInt(),
                rec.get("matched").asList(v -> v.asString()), rec.get("missing").asList(v -> v.asString())
        );
    }
}
