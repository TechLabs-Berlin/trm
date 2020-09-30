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
      log.debug(`GraphQL API returned an error`, { query: body, error: result })
      return Promise.reject({
        reason: `GraphQL API responded with ${resp.status}`,
        error: result
      })
    }

    if(typeof result.errors !== 'undefined') {
      log.debug('GraphQL API responded with an error result', { query: body, error: result.errors })
      return Promise.reject({
        reason: `GraphQL API responded with an error result`,
        error: result.errors
      })
    }

    if(!('data' in result)) {
      log.debug('GraphQL API result does not contain data', { query: body, result })
      return Promise.reject({
        reason: 'Expected result from GraphQL API to contain data',
        error: result
      })
    }

    log.debug('GraphQL data', { query: body, data: result.data })

    return result.data
  }

  return {
    getForm: async ({ id }) => {
      const data = await fetchQuery({
        query: `
          query GetForm($id: uuid!) {
            forms(where: {id: {_eq: $id}}, limit: 1) {
              id
              created_at
              description
              typeform_id
              form_type
              location
              semester_id
              typeform_secret
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
          error: data
        })
      }

      return data.forms[0]
    },
    doesFormResponseExist: async ({ formID, typeformResponseToken }) => {
      const data = await fetchQuery({
        query: `
          query GetFormResponse($formID: uuid!, $typeformResponseToken: String!) {
            form_responses(where: {form_id: {_eq: $formID}, typeform_response_token: {_eq: $typeformResponseToken}}, limit: 1) {
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
        !data.form_responses ||
        !Array.isArray(data.form_responses)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.form_responses.length >= 1
    },
    createFormResponse: async ({ formID, typeformResponseToken, typeformEvent, answers }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateFormResponse($formID: uuid!, $typeformResponseToken: String!, $typeformEvent: jsonb!, $answers: jsonb!) {
            insert_form_responses_one(object: {form_id: $formID, typeform_response_token: $typeformResponseToken, typeform_event: $typeformEvent, answers: $answers}) {
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
        !data.insert_form_responses_one ||
        !('id' in data.insert_form_responses_one)
        ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.insert_form_responses_one.id
    },
    createTechie: async ({ location, semesterID, state, techieKey }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateTechie($location: locations_enum!, $semesterID: uuid!, $state: techie_lifecycle_states_enum!, $techieKey: String!) {
            insert_techies_one(object: {location: $location, semester_id: $semesterID, state: $state, techie_key: $techieKey}) {
              id
              semester_id
              state
              techie_key
              first_name
              last_name
              email
              application_track_choice
              created_at
              updated_at
              gender
              age
              google_account
              github_handle
              edyoucated_handle
              linkedin_profile_url
            }
          }
        `,
        variables: {
          location,
          semesterID,
          state,
          techieKey
        }
      })

      if(!data.insert_techies_one) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.insert_techies_one
    },
    associateTechieWithFormResponse: async ({ techieID, formResponseID }) => {
      const data = await fetchQuery({
        query: `
          mutation CreateTechie($techieID: uuid!, $formResponseID: uuid!) {
            update_form_responses_by_pk(pk_columns: {id: $formResponseID}, _set: {techie_id: $techieID, updated_at: "now()"}) {
              id
            }
          }
        `,
        variables: {
          techieID,
          formResponseID
        }
      })

      if(
        !data.update_form_responses_by_pk ||
        !('id' in data.update_form_responses_by_pk)
        ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    getTypeformToken: async ({ location }) => {
      const data = await fetchQuery({
        query: `
          query GetTypeformToken($location: locations_enum!) {
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
          error: data
        })
      }

      return data.typeform_users[0].token
    },
    getExistingTypeformResponseTokensForForm: async ({ formID, typeformResponseTokens }) => {
      const data = await fetchQuery({
        query: `
          query GetTypeformTokenForForm($formID: uuid!, $typeformResponseTokens: [String!]!) {
            form_responses(where: {form_id: {_eq: $formID}, typeform_response_token: {_in: $typeformResponseTokens}}) {
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
        !data.form_responses ||
        !Array.isArray(data.form_responses)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.form_responses
        .map(response => response.typeform_response_token)
        .filter(Boolean) // removes falsy elements in case typeform_response_token is undefined
    },
    setWebhookInstalledAt: async ({ formID }) => {
      const data = await fetchQuery({
        query: `
          mutation SetWebhookInstalledAt($formID: uuid!) {
            update_forms(where: {id: {_eq: $formID}}, _set: {webhook_installed_at: "now()", updated_at: "now()"}) {
              affected_rows
            }
          }
        `,
        variables: {
          formID
        }
      })

      if(
        !data.update_forms ||
        !data.update_forms.affected_rows ||
        data.update_forms.affected_rows !== 1
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    findTechieByID: async ({ id }) => {
      const data = await fetchQuery({
        query: `
          query GetTechie($id: uuid!) {
            techies_by_pk(id: $id) {
              created_at
              email
              first_name
              id
              last_name
              location
              semester_id
              state
              application_track_choice
              techie_key
              updated_at
              gender
              age
              google_account
              github_handle
              edyoucated_handle
              linkedin_profile_url
            }
          }
        `,
        variables: {
          id
        }
      })

      if(!('techies_by_pk' in data)) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      if(!data.techies_by_pk) {
        return { found: false }
      }

      return {
        found: true,
        techie: data.techies_by_pk
      }
    },
    findTechieByTechieKey: async ({ location, semesterID, techieKey }) => {
      const data = await fetchQuery({
        query: `
          query FindTechieByTechieKey($location: locations_enum!, $semesterID: uuid!, $techieKey: String!) {
            techies(limit: 1, where: {_and: {location: {_eq: $location}, semester_id: {_eq: $semesterID}, techie_key: {_eq: $techieKey }}}) {
              id
              semester_id
              state
              techie_key
              first_name
              last_name
              email
              application_track_choice
              created_at
              updated_at
              gender
              age
              google_account
              github_handle
              edyoucated_handle
              linkedin_profile_url
            }
          }
        `,
        variables: {
          location,
          semesterID,
          techieKey
        }
      })

      if(
        !data.techies ||
        !Array.isArray(data.techies)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      if(data.techies.length == 0) {
        return {
          found: false
        }
      }

      return {
        found: true,
        techie: data.techies[0]
      }
    },
    findTechieByEmail: async ({ location, semesterID, email }) => {
      const data = await fetchQuery({
        query: `
          query FindTechieByTechieKey($location: locations_enum!, $semesterID: uuid!, $email: String!) {
            techies(limit: 1, where: {_and: {location: {_eq: $location}, semester_id: {_eq: $semesterID}, email: {_eq: $email }}}) {
              id
              semester_id
              state
              techie_key
              first_name
              last_name
              email
              application_track_choice
              created_at
              updated_at
              gender
              age
              google_account
              github_handle
              edyoucated_handle
              linkedin_profile_url
            }
          }
        `,
        variables: {
          location,
          semesterID,
          email
        }
      })

      if(
        !data.techies ||
        !Array.isArray(data.techies)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      if(data.techies.length === 0) {
        return {
          found: false
        }
      }

      return {
        found: true,
        techie: data.techies[0]
      }
    },
    // id is expected to be included in attributes
    updateTechieMasterData: async (attributes) => {
      const data = await fetchQuery({
        query: `
          mutation UpdateTechieMasterData(
            $id: uuid!,
            $email: String,
            $first_name: String,
            $last_name: String,
            $state: techie_lifecycle_states_enum!,
            $techie_key: String!,
            $application_track_choice: tracks_enum,
            $gender: String,
            $age: smallint,
            $google_account: String,
            $github_handle: String,
            $edyoucated_handle: String,
            $linkedin_profile_url: String
          ) {
            update_techies_by_pk(
              pk_columns: {id: $id},
              _set: {
                email: $email,
                first_name: $first_name,
                last_name: $last_name,
                state: $state,
                techie_key: $techie_key,
                application_track_choice: $application_track_choice,
                gender: $gender,
                age: $age,
                google_account: $google_account,
                github_handle: $github_handle,
                edyoucated_handle: $edyoucated_handle,
                linkedin_profile_url: $linkedin_profile_url,
                updated_at: "now()"
              }) {
              id
            }
          }
        `,
        variables: attributes
      })

      if(
        !data.update_techies_by_pk ||
        !('id' in data.update_techies_by_pk) ||
        data.update_techies_by_pk.id !== attributes.id
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    }
  }
}
