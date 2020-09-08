FROM hasura/graphql-engine:v1.3.1.cli-migrations-v2

COPY migrations /migrations
ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/migrations
ENV HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=60
