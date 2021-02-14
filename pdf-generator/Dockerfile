FROM thecodingmachine/gotenberg:6.4.0

USER root
# Work around https://github.com/thecodingmachine/gotenberg/issue/90
RUN chown gotenberg:gotenberg /tini
USER gotenberg

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "wget", "-O-", "http://localhost:3000/ping" ]
