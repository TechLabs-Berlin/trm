Build and push the Docker image manually:

```
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://europe-west3-docker.pkg.dev
docker build -t europe-west3-docker.pkg.dev/techlabs-trm-test/trm/hasura:staging .
docker push europe-west3-docker.pkg.dev/techlabs-trm-test/trm/hasura:staging
```
