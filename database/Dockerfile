FROM hasura/graphql-engine:v1.3.2.cli-migrations-v2

COPY metadata /metadata
COPY migrations /migrations
COPY config.yaml /

ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/migrations HASURA_GRAPHQL_METADATA_DIR=/metadata HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=60
