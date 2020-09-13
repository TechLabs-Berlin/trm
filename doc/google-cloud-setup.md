# Google Cloud Setup

1. Log into the [Google Cloud Console](https://console.cloud.google.com/)
2. [Create a new project](https://console.cloud.google.com/projectcreate) for TRM
3. Set the TRM project as the active project:
   ![Setting the TRM project as the active project](resources/gcp-console-project.png)

## Setup OAuth

In the sidebar at _APIs & Services_ , select _Credentials_

**Configure OAuth consent screen**

1. Set the application type to _Internal_
2. Set the Scopes for Google APIs to _email_, _profile_, _openid_, and _../auth/admin.directory.group.readonly_
3. Set the Authorized domains to _techlabs.org_
4. Click _Save_

**Create the Credentials for _staging_**

1. At _Credentials_, click _Create Credentials_ 
1. Choose _OAuth client ID_
2. As Application type, choose _Web application_ and set the name to _TRM_
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
2. As Application type, choose _Web application_ and set the name to _TRM_
4. For the Authorized JavaScript origins, set:
   - `https://trm.techlabs.org`
5. For the Authorized redirect URIs, set:
   - `https://trm.techlabs.org/oauth/callback`
6. Take note of Client ID and Client secret

## Setup DNS

1. Take note of the `dns_name_servers` output variable of the [`/infrastructure/common`](/infrastructure/common) Terraform project. You can get the value by e.g. running `terraform output dns_name_servers`. The output looks like this:

   ```
   $ terraform output dns_name_servers
   [
     "ns-cloud-e1.googledomains.com.",
     "ns-cloud-e2.googledomains.com.",
     "ns-cloud-e3.googledomains.com.",
     "ns-cloud-e4.googledomains.com.",
   ]
   ```

2. Create delegating NS records at the upstream DNS provider IONOS for `techlabs.org`
   (change the DNS record values to the matching ones in the Terraform output)

   ```
   trm CNAME ns-cloud-e1.googledomains.com. 86400
   trm CNAME ns-cloud-e2.googledomains.com. 86400
   trm CNAME ns-cloud-e3.googledomains.com. 86400
   trm CNAME ns-cloud-e4.googledomains.com. 86400
   ```

   (CNAME record for the `trm` subdomain with value `ns-cloud-e*.googledomains.com.` and TTL 86400s [1 day])

