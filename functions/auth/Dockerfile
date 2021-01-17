FROM node:12-alpine

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "/bin/sh", "-c", "wget -O- http://localhost:8000/healthz | grep ok" ]

RUN mkdir -p /usr/src/app \
 && adduser -s /bin/false -D app \
 && chown app:app /usr/src/app
WORKDIR /usr/src/app
COPY functions/auth/package.json functions/auth/package-lock.json /usr/src/app/
RUN npm install
COPY functions/auth /usr/src/app/
RUN rm -rf pkg/trm-api
COPY lib/trm-api /usr/src/app/pkg/trm-api
CMD ["dev.js"]
