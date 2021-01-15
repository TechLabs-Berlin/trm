FROM hasura/graphql-engine:v1.3.3.cli-migrations-v2

RUN adduser -D hasura \
 && mkdir /seeds \
 && chown hasura:nogroup /seeds

COPY --chown=hasura:nogroup metadata /metadata
COPY --chown=hasura:nogroup migrations /migrations
COPY config.yaml /

ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/migrations HASURA_GRAPHQL_METADATA_DIR=/metadata HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=60
USER hasura
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 CMD [ "/bin/wget", "-O-", "http://localhost:8080/healthz" ]
