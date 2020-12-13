# auth

The function uses [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/production#auth-cloud-implicit-nodejs) to authenticate requests to the Google Groups API. This used to find out which groups (TechLabs locations) a user is a member of.

On Google Cloud Functions, the service account is used.

For local development, set `GOOGLE_APPLICATION_CREDENTIALS` to the path to the Service Account credentials JSON file.

Moreover, set `GOOGLE_IMPERSONATE_USER` to a Google account which can use the Google Groups API. Any admin will work.
