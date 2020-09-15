module.exports = ({graphqlURL, token, fetch, log}) => {
  const fetchQuery = async (body) => {
    const resp = await fetch(
      graphqlURL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
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

    if(!('data' in result)) {
      return Promise.reject({
        reason: 'Expected result from GraphQL API to contain data',
        error: result
      })
    }

    return result.data
  }

  return {
    getForm: async ({ id }) => {
      const data = await fetchQuery({
        query: `
          query GetForm($id: uuid) {
            forms(where: {id: {_eq: $id}}, limit: 1) {
              id
              created_at
              description
              form_id
              imports_techies
              location
              secret
              updated_at
              webhook_installed_at
            }
          }
        `,
        variables: {
          id
        }
      })

      if(
        !data.forms ||
        !Array.isArray(data.forms) ||
        data.forms.length === 0
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.forms[0]
    },
    doesFormSubmissionExist: async ({ formID, typeformResponseToken }) => {
      const data = await fetchQuery({
        query: `
          query GetFormSubmission($formID: uuid, $typeformResponseToken: String) {
            form_submissions(where: {form_id: {_eq: $formID}, typeform_response_token: {_eq: $typeformResponseToken}}, limit: 1) {
              id
            }
          }
        `,
        variables: {
          formID,
          typeformResponseToken
        }
      })

      if(
        !data.form_submissions ||
        !Array.isArray(data.form_submissions)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.form_submissions.length >= 1
    },
    createFormSubmission: async ({ formID, typeformResponseToken, typeformEvent, answers }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateFormSubmission($formID: uuid, $typeformResponseToken: String, $typeformEvent: jsonb, $answers: jsonb) {
            insert_form_submissions_one(object: {form_id: $formID, typeform_response_token: $typeformResponseToken, typeform_event: $typeformEvent, answers: $answers, created_at: "now()", updated_at: "now()"}) {
              id
            }
          }
        `,
        variables: {
          formID,
          typeformResponseToken,
          typeformEvent,
          answers
        }
      })

      if(
        !data.insert_form_submissions_one ||
        !('id' in data.insert_form_submissions_one)
        ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.insert_form_submissions_one.id
    },
    createTechie: async ({ location, semester, state, techieKey }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateTechie($location: String, $semester: String, $state: String, $techieKey: String) {
            insert_techies_one(object: {location: $location, semester: $semester, state: $state, techie_key: $techieKey, created_at: "now()", updated_at: "now()"}) {
              id
            }
          }
        `,
        variables: {
          location,
          semester,
          state,
          techieKey
        }
      })

      if(
        !data.insert_techies_one ||
        !('id' in data.insert_techies_one)
        ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.insert_techies_one.id
    },
    associateTechieWithFormSubmission: async ({ techieID, formSubmissionID }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateTechie($techieID: uuid, $formSubmissionID: uuid!) {
            update_form_submissions_by_pk(pk_columns: {id: $formSubmissionID}, _set: {techie_id: $techieID}) {
              id
            }
          }
        `,
        variables: {
          techieID,
          formSubmissionID
        }
      })

      if(
        !data.update_form_submissions_by_pk ||
        !('id' in data.update_form_submissions_by_pk)
        ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return
    },
    getTypeformToken: async ({ location }) => {
      const data = await fetchQuery({
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

      if(
        !data.typeform_users ||
        !Array.isArray(data.typeform_users) ||
        data.typeform_users.length === 0 ||
        !('token' in data.typeform_users[0])
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.typeform_users[0].token
    },
    getExistingTypeformResponseTokensForForm: async ({ formID, typeformResponseTokens }) => {
      const data = await fetchQuery({
        query: `
          query GetTypeformTokenForForm($formID: uuid!, $typeformResponseTokens: [String!]!) {
            form_submissions(where: {form_id: {_eq: $formID}, typeform_response_token: {_in: $typeformResponseTokens}}) {
              typeform_response_token
            }
          }
        `,
        variables: {
          formID,
          typeformResponseTokens
        }
      })

      if(
        !data.form_submissions ||
        !Array.isArray(data.form_submissions)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: result.data
        })
      }

      return data.form_submissions
        .map(submission => submission.typeform_response_token)
        .filter(Boolean) // removes falsy elements in case typeform_response_token is undefined
    }
  }
}
