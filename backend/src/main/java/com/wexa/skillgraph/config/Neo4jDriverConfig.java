package com.wexa.skillgraph.config;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Config;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires up the official Neo4j Bolt driver against CognoDB Cloud.
 * CognoDB speaks openCypher over Bolt 5.x, so the stock driver works unmodified --
 * no custom SDK needed. Connection details always come from environment variables
 * (see application.yml), never from source.
 */
@Configuration
public class Neo4jDriverConfig {

    @Value("${cognodb.uri}")
    private String uri;

    @Value("${cognodb.user}")
    private String user;

    @Value("${cognodb.password}")
    private String password;

    @Bean(destroyMethod = "close")
    public Driver neo4jDriver() {
        Config config = Config.builder()
                .withMaxConnectionPoolSize(20)
                .withConnectionAcquisitionTimeout(10, java.util.concurrent.TimeUnit.SECONDS)
                .build();
        return GraphDatabase.driver(uri, AuthTokens.basic(user, password), config);
    }
}
