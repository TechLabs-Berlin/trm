FROM node:12-alpine

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "/bin/sh", "-c", "wget -O- http://localhost:8000/healthz | grep ok" ]

RUN mkdir -p /usr/src/app \
 && adduser -s /bin/false -D app \
 && chown app:app /usr/src/app
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/pkg
COPY certificate-generator/package.json certificate-generator/package-lock.json /usr/src/app/
COPY lib /usr/src/lib
RUN npm install
COPY certificate-generator /usr/src/app/
CMD ["server.js"]
