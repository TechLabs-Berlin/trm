# auth

This function uses the Google Groups API to find out which groups (TechLabs locations) a user is member of. It then creates a JWT for authentication to the TRM database (Hasura).

For local development, set `GOOGLE_SERVICE_ACCOUNT_JSON` with the service account credentials (actual content, not path to the file).

Moreover, set `GOOGLE_IMPERSONATE_USER` to a Google account which can use the Google Groups API. Any admin will work.
