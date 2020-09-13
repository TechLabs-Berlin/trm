module.exports = ({graphqlURL, token, fetch, log}) => {
  return {
    getTypeformToken: async ({ location }) => {
      const resp = await fetch(
        graphqlURL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query GetTypeformToken($location: String) {
                typeform_users(where: {location: {_eq: $location}}, limit: 1) {
                  token
                }
              }
            `,
            variables: {
              location
            }
          })
        }
      )

      const result = await resp.json()

      if(!resp.ok) {
        log.debug(`GraphQL API returned an error`, { error: result })
        return Promise.reject({
          reason: `GraphQL API responded with ${resp.status}`,
          error: result
        })
      }

      if(typeof result.errors !== 'undefined') {
        return Promise.reject({
          reason: `GraphQL API responded with an error result`,
          error: result.errors
        })
      }

      if(
        !result.data ||
        !result.data.typeform_users ||
        !Array.isArray(result.data.typeform_users) ||
        result.data.typeform_users.length === 0 ||
        !('token' in result.data.typeform_users[0])
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return result.data.typeform_users[0].token
    },
    setWebhookInstalledAt: async ({ formID }) => {
      const resp = await fetch(
        graphqlURL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              mutation SetWebhookInstalledAt($form_id: uuid) {
                update_forms(where: {id: {_eq: $form_id}}, _set: {webhook_installed_at: "now()"}) {
                  affected_rows
                }
              }
            `,
            variables: {
              form_id: formID
            }
          })
        }
      )

      const result = await resp.json()

      if(!resp.ok) {
        log.debug(`GraphQL API returned an error`, { error: result })
        return Promise.reject({
          reason: `GraphQL API responded with ${resp.status}`,
          error: result
        })
      }

      if(typeof result.errors !== 'undefined') {
        return Promise.reject({
          reason: `GraphQL API responded with an error result`,
          error: result.errors
        })
      }

      if(!result.data || !result.data.update_forms || result.data.update_forms.affected_rows !== 1) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return
    }
  }
}
