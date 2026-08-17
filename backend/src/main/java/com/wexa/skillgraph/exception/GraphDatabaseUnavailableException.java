package com.wexa.skillgraph.exception;

/** Thrown when CognoDB cannot be reached (connection refused, auth failure, timeout, etc). */
public class GraphDatabaseUnavailableException extends RuntimeException {
    public GraphDatabaseUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
