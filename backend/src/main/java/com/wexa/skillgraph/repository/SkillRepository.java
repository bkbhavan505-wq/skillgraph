package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.model.Skill;
import com.wexa.skillgraph.model.SkillPath;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class SkillRepository {

    private final GraphExecutor db;

    public SkillRepository(GraphExecutor db) {
        this.db = db;
    }

    public List<Skill> findAll() {
        String cypher = "MATCH (s:Skill) RETURN s.name AS name, s.category AS category ORDER BY s.category, s.name";
        return db.readList(cypher, Map.of(), rec ->
                new Skill(rec.get("name").asString(), rec.get("category").asString()));
    }

    /** Skills directly related to a given skill, e.g. what pairs well with "React". */
    public List<Skill> findRelated(String skillName) {
        String cypher = """
            MATCH (s:Skill {name: $name})-[:RELATED_TO]-(other:Skill)
            RETURN DISTINCT other.name AS name, other.category AS category
            ORDER BY other.name
            """;
        return db.readList(cypher, Map.of("name", skillName), rec ->
                new Skill(rec.get("name").asString(), rec.get("category").asString()));
    }

    /**
     * Shortest chain of RELATED_TO hops between two skills, using the driver's
     * variable-length shortestPath. This is the textbook "relational databases
     * find this awkward" query -- in SQL you'd need a recursive CTE with a
     * cycle guard and manual path reconstruction; here it's one pattern.
     */
    public Optional<SkillPath> shortestSkillPath(String from, String to) {
        String cypher = """
            MATCH path = shortestPath((a:Skill {name: $from})-[:RELATED_TO*..6]-(b:Skill {name: $to}))
            RETURN [n IN nodes(path) | n.name] AS names, length(path) AS hops
            """;
        return db.readOne(cypher, Map.of("from", from, "to", to), rec ->
                new SkillPath(rec.get("names").asList(v -> v.asString()), rec.get("hops").asInt()));
    }
}
