package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.model.Candidate;
import com.wexa.skillgraph.model.CandidateSkill;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class CandidateRepository {

    private final GraphExecutor db;

    public CandidateRepository(GraphExecutor db) {
        this.db = db;
    }

    public List<Candidate> findAll() {
        String cypher = """
            MATCH (c:Candidate)
            RETURN c.id AS id, c.name AS name, c.email AS email, c.location AS location,
                   c.experienceYears AS experienceYears, c.bio AS bio
            ORDER BY c.name
            """;
        return db.readList(cypher, Map.of(), this::mapCandidate);
    }

    public Optional<Candidate> findById(String id) {
        String cypher = """
            MATCH (c:Candidate {id: $id})
            RETURN c.id AS id, c.name AS name, c.email AS email, c.location AS location,
                   c.experienceYears AS experienceYears, c.bio AS bio
            """;
        return db.readOne(cypher, Map.of("id", id), this::mapCandidate);
    }

    /** The candidate's skills, one hop out: (Candidate)-[:HAS_SKILL]->(Skill). */
    public List<CandidateSkill> findSkills(String candidateId) {
        String cypher = """
            MATCH (c:Candidate {id: $id})-[r:HAS_SKILL]->(s:Skill)
            RETURN s.name AS skillName, s.category AS category,
                   r.proficiency AS proficiency, r.years AS years
            ORDER BY r.proficiency DESC
            """;
        return db.readList(cypher, Map.of("id", candidateId), rec -> new CandidateSkill(
                rec.get("skillName").asString(),
                rec.get("category").asString(),
                rec.get("proficiency").asInt(),
                rec.get("years").asInt()
        ));
    }

    /**
     * Candidates who share at least one skill with the given candidate -- a 2-hop
     * traversal (Candidate)-[:HAS_SKILL]->(Skill)<-[:HAS_SKILL]-(Candidate) that a
     * relational join can express, but that gets awkward fast once you want to rank
     * by *how many* skills overlap and list which ones, in one pass, with no self-join
     * explosion. This powers "candidates like you".
     */
    public List<Map<String, Object>> findSimilarCandidates(String candidateId, int limit) {
        String cypher = """
            MATCH (me:Candidate {id: $id})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(other:Candidate)
            WHERE other.id <> $id
            WITH other, collect(DISTINCT s.name) AS sharedSkills
            RETURN other.id AS id, other.name AS name, other.location AS location,
                   other.experienceYears AS experienceYears, other.bio AS bio, other.email AS email,
                   size(sharedSkills) AS sharedCount, sharedSkills
            ORDER BY sharedCount DESC
            LIMIT $limit
            """;
        return db.readList(cypher, Map.of("id", candidateId, "limit", limit), rec -> Map.of(
                "candidate", mapCandidate(rec),
                "sharedSkillCount", rec.get("sharedCount").asInt(),
                "sharedSkills", rec.get("sharedSkills").asList(v -> v.asString())
        ));
    }

    public Candidate create(Candidate c) {
        String cypher = """
            CREATE (c:Candidate {id: $id, name: $name, email: $email, location: $location,
                                  experienceYears: $experienceYears, bio: $bio})
            """;
        db.write(cypher, Map.of(
                "id", c.id(), "name", c.name(), "email", c.email(), "location", c.location(),
                "experienceYears", c.experienceYears(), "bio", c.bio() == null ? "" : c.bio()
        ));
        return c;
    }

    private Candidate mapCandidate(org.neo4j.driver.Record rec) {
        return new Candidate(
                rec.get("id").asString(),
                rec.get("name").asString(),
                rec.get("email").asString(),
                rec.get("location").asString(),
                rec.get("experienceYears").asInt(0),
                rec.get("bio").asString("")
        );
    }
}
