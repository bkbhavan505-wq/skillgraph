package com.wexa.skillgraph.repository;

import com.wexa.skillgraph.exception.GraphDatabaseUnavailableException;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;
import org.neo4j.driver.exceptions.Neo4jException;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

/**
 * Thin wrapper around the Neo4j driver that centralises session handling and
 * turns any connectivity failure into a GraphDatabaseUnavailableException so
 * controllers can return a clean 503 instead of a stack trace.
 *
 * All queries are parameterised (Cypher text never has user input concatenated in) --
 * callers pass a params map that the driver sends separately from the query text.
 */
@Component
public class GraphExecutor {

    private final Driver driver;

    public GraphExecutor(Driver driver) {
        this.driver = driver;
    }

    public <T> List<T> readList(String cypher, Map<String, Object> params, Function<Record, T> mapper) {
        try (Session session = driver.session()) {
            return session.executeRead(tx -> {
                var result = tx.run(cypher, Values.value(params));
                List<T> out = new ArrayList<>();
                while (result.hasNext()) {
                    out.add(mapper.apply(result.next()));
                }
                return out;
            });
        } catch (Neo4jException e) {
            throw new GraphDatabaseUnavailableException("Failed to read from CognoDB", e);
        }
    }

    public <T> Optional<T> readOne(String cypher, Map<String, Object> params, Function<Record, T> mapper) {
        List<T> results = readList(cypher, params, mapper);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void write(String cypher, Map<String, Object> params) {
        try (Session session = driver.session()) {
            session.executeWrite(tx -> tx.run(cypher, Values.value(params)).consume());
        } catch (Neo4jException e) {
            throw new GraphDatabaseUnavailableException("Failed to write to CognoDB", e);
        }
    }

    /** Quick connectivity probe used by the health endpoint. */
    public boolean ping() {
        try (Session session = driver.session()) {
            session.run("RETURN 1").consume();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
