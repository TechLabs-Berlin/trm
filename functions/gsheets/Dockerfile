FROM node:12-alpine

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "/usr/bin/wget", "-O-", "http://localhost:4000/.well-known/apollo/server-health" ]

RUN mkdir -p /usr/src/app \
 && adduser -s /bin/false -D app \
 && chown app:app /usr/src/app
WORKDIR /usr/src/app
COPY gsheets/package.json gsheets/package-lock.json /usr/src/app/
COPY lib /usr/src/lib
RUN npm install
COPY gsheets /usr/src/app
CMD ["dev.js"]
