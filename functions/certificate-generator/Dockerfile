FROM node:12-alpine

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "/bin/sh", "-c", "wget -O- http://localhost:8000/healthz | grep ok" ]

RUN mkdir -p /usr/src/app \
 && adduser -s /bin/false -D app \
 && chown app:app /usr/src/app
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/pkg
COPY lib/trm-api /usr/src/app/pkg/trm-api
COPY functions/certificate-generator/package.json functions/certificate-generator/package-lock.json /usr/src/app/
RUN npm install
COPY functions/certificate-generator /usr/src/app/

CMD ["server.js"]
