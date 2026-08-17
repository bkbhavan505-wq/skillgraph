// Standalone seed loader -- not part of the running Spring app, has its own main().
// Run from the backend/ directory with:
//   mvn -q compile exec:java -Dexec.mainClass=com.wexa.skillgraph.seed.SeedLoader
//
// Reads COGNODB_URI / COGNODB_USER / COGNODB_PASSWORD from the environment,
// splits seed.cypher on statement-terminating semicolons, and runs each
// statement in its own transaction so a mid-file failure doesn't silently
// roll back everything already loaded.

package com.wexa.skillgraph.seed;

import org.neo4j.driver.*;
import java.nio.file.*;
import java.util.*;

public class SeedLoader {
    public static void main(String[] args) throws Exception {
        String uri = requireEnv("COGNODB_URI");
        String user = requireEnv("COGNODB_USER");
        String password = requireEnv("COGNODB_PASSWORD");
        String path = args.length > 0 ? args[0] : "seed/seed.cypher";

        String script = Files.readString(Path.of(path));
        List<String> statements = new ArrayList<>();
        for (String line : script.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.isEmpty() || trimmed.startsWith("//")) continue;
            statements.add(line);
        }
        String joined = String.join("\n", statements);
        String[] parts = joined.split(";");

        try (Driver driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password))) {
            driver.verifyConnectivity();
            System.out.println("Connected to CognoDB. Loading " + parts.length + " statements...");
            try (Session session = driver.session()) {
                int count = 0;
                for (String stmt : parts) {
                    String cypher = stmt.trim();
                    if (cypher.isEmpty()) continue;
                    session.executeWrite(tx -> tx.run(cypher).consume());
                    count++;
                }
                System.out.println("Done. Executed " + count + " statements.");
            }
        }
    }

    private static String requireEnv(String key) {
        String v = System.getenv(key);
        if (v == null || v.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + key);
        }
        return v;
    }
}
