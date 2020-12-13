# Google Cloud Setup

1. Log into the [Google Cloud Console](https://console.cloud.google.com/)
2. [Create a new project](https://console.cloud.google.com/projectcreate) for TRM
3. Set the TRM project as the active project:
   ![Setting the TRM project as the active project](resources/gcp-console-project.png)

## Enable APIs

- [Admin SDK](https://console.cloud.google.com/apis/library/admin.googleapis.com) – for Google Auth
- Enable Cloud DNS API
- Enable Cloud Scheduler API, go to Cloud Scheduler in Console and create a Job to create an App Engine application
- Enable Google Drive API
- Enable Google Sheets API
- Enable IAM
- Enable Cloud SQL Admin
- Enable Compute Engine API
- Enable Cloud Functions API
- Enable Cloud Run API
- Enable Artifact Registry API
- Enable Cloud Build

## Setup OAuth

In the sidebar at _APIs & Services_ , select _Credentials_

**Configure OAuth consent screen**

1. Set the application type to _Internal_
2. Set the Application name to _TechLabs TRM_
3. Set the Scopes for Google APIs to _email_, _profile_, and _openid_
4. Set the Authorized domains to _techlabs.org_
5. Click _Save_

**Create the Credentials for _staging_**

1. At _Credentials_, click _Create Credentials_
1. Choose _OAuth client ID_
2. As Application type, choose _Web application_ and set the name to _trm-staging_
3. For the Authorized JavaScript origins, set:
   - `http://localhost:3000`
   - `https://staging.trm.techlabs.org`
4. For the Authorized redirect URIs, set:
   - `http://localhost:3000/oauth/callback`
   - `https://staging.trm.techlabs.org/oauth/callback`
6. Take note of Client ID and Client secret

**Create the Credentials for _production_**

1. At _Credentials_, click _Create Credentials_
1. Choose _OAuth client ID_
2. As Application type, choose _Web application_ and set the name to _trm-production_
4. For the Authorized JavaScript origins, set:
   - `https://trm.techlabs.org`
5. For the Authorized redirect URIs, set:
   - `https://trm.techlabs.org/oauth/callback`
6. Take note of Client ID and Client secret

**Create a Service Account for _auth_**

1. Go to _IAM & Admin_, click _Service Accounts_
2. Click _Create Service Account_
3. For service account name set _trm-auth_
4. Skip service account permissions (click _continue_)
5. Skip grant users access to this service account (click _done_)
6. Locate the service account in the table, under _Actions_ choose _Edit_
7. Click _Show Domain-Wide Delegation_, enable _Enable G Suite Domain-wide Delegation_
8. Click _Save_ and return to the edit view
9. Copy _Client ID_ at Domain-wide Delegation

At the G Suite Admin Console ([admin.google.com](https://admin.google.com)):

1. Go to _Security_ and click on _API controls_
2. Select _Manage Domain Wide Delegation_
3. Click _Add new_
4. In the Client ID field, enter the client ID copied in the first step
5. In the OAuth Scopes field, enter `https://www.googleapis.com/auth/admin.directory.group.readonly`
6. Click _Authorize_

See [docs for domain-wide delegation](https://developers.google.com/admin-sdk/directory/v1/guides/delegation).

## Setup DNS

1. Take note of the `dns_name_servers` output variable of the [`/infrastructure/common`](/infrastructure/common) Terraform project. You can get the value by e.g. running `terraform output google_dns_name_servers`. The output looks like this:

   ```
   $ terraform output google_dns_name_servers
   [
     "ns-cloud-a1.googledomains.com.",
     "ns-cloud-a2.googledomains.com.",
     "ns-cloud-a3.googledomains.com.",
     "ns-cloud-a4.googledomains.com.",
   ]
   ```

2. Create delegating NS records at the upstream DNS provider IONOS for `techlabs.org`
   (change the DNS record values to the matching ones in the Terraform output)

   ```
   trm CNAME ns-cloud-a1.googledomains.com. 86400
   trm CNAME ns-cloud-a2.googledomains.com. 86400
   trm CNAME ns-cloud-a3.googledomains.com. 86400
   trm CNAME ns-cloud-a4.googledomains.com. 86400
   ```

   (CNAME record for the `trm` subdomain with value `ns-cloud-e*.googledomains.com.` and TTL 86400s [1 day])

# Validate Domain at Webmaster Central

Validating the domain is required to be able to use [custom domain names with Cloud Run](https://cloud.google.com/run/docs/mapping-custom-domains).

1. Go to the [Webmaster Central Console](https://www.google.com/webmasters/verification/home)

2. Click on _Add Property_

3. Enter _techlabs.org_

4. Select _Alternate methods_ → _Domain name provider_ → _Other_

5. Add the given DNS record at the upstream DNS provider IONOS for `techlabs.org`

   ```
   @ TXT google-site-verification=SOMETHING 86400
   ```

   (TXT record for `techlabs.org` with given value and TTL 86400s [1 day])

# Deploy the TRM resources to Google Cloud

1. Create a service account _terraform_
   * Role _Owner_

2. Create & download a new key for the service account _terraform_

2. Create a storage bucket _techlabs-trm-state_
   * Region _europe-west3_
   * Storage Class _Standard_
   * Access control _Fine-grained_
   * No advanced settings
