FROM hasura/graphql-engine:v1.3.2.cli-migrations-v2 as hasura

FROM ubuntu:focal

COPY --from=hasura /bin/graphql-engine /usr/local/bin/graphql-engine
COPY --from=hasura /bin/hasura-cli /usr/local/bin/hasura-cli

# Add non-root user as workaround for https://github.com/hasura/graphql-engine/issues/4651
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates libpq5 netcat-openbsd \
 && adduser --system --disabled-login hasura \
 && mkdir /seeds \
 && chown hasura:nogroup /seeds
COPY docker-entrypoint.sh /docker-entrypoint.sh
USER hasura
RUN hasura-cli plugin install cli-ext

COPY --chown=hasura:nogroup metadata /metadata
COPY --chown=hasura:nogroup migrations /migrations
COPY config.yaml /

ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/migrations HASURA_GRAPHQL_METADATA_DIR=/metadata HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=60
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/local/bin/graphql-engine", "serve"]
