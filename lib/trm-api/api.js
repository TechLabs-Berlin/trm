var buildRepo = require('./repository/repository')

module.exports = async ({graphqlURL, token, fetch, log}) => {
  const { queries, mutations } = await buildRepo()

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
        query: queries.fetch('GET_FORM'),
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
        query: queries.fetch('GET_FORM_RESPONSE'),
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
        query: mutations.fetch('CREATE_FORM_RESPONSE'),
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
        query: mutations.fetch('CREATE_TECHIE'),
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
        query: mutations.fetch('UPDATE_FORM_RESPONSE'),
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
        query: queries.fetch('GET_TYPEFORM_TOKEN'),
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
        query: queries.fetch('GET_TYPEFORM_RESPONSE_TOKENS_FOR_FORM'),
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
        query: mutations.fetch('SET_WEBHOOK_INSTALLED_AT'),
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
        query: queries.fetch('GET_TECHIE_BY_ID'),
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
        query: queries.fetch('GET_TECHIE_BY_TECHIE_KEY'),
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
        query: queries.fetch('GET_TECHIE_BY_EMAIL'),
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
        query: mutations.fetch('UPDATE_TECHIE_MASTER_DATA'),
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
    },
    getTechiesWithoutEdyoucatedUserID: async () => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIES_WITHOUT_EDYOUCATED_USER_ID')
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

      return data.techies
    },
    getTechiesPendingEdyoucatedImport: async () => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIES_PENDING_EDYOUCATED_IMPORT')
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

      return data.techies
    },
    getEdyoucatedUsers: async ({ usernames }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_EDYOUCATED_USERS'),
        variables: { usernames }
      })

      if(
        !data.edyoucated_users ||
        !Array.isArray(data.edyoucated_users)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.edyoucated_users
    },
    getEdyoucatedActivity: async ({ userIDs }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_EDYOUCATED_ACTIVITY'),
        variables: { userIDs }
      })

      if(
        !data.edyoucated_activity ||
        !Array.isArray(data.edyoucated_activity)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.edyoucated_activity
    },
    updateTechieEdyoucatedUserID: async ({ id, edyoucatedUserID, edyoucatedNextImportAfter }) => {
      const data = await fetchQuery({
        query: mutations.fetch('UPDATE_TECHIE_EDYOUCATED_USER_ID'),
        variables: { id, edyoucatedUserID, edyoucatedNextImportAfter }
      })

      if(
        !data.update_techies_by_pk ||
        !('id' in data.update_techies_by_pk) ||
        data.update_techies_by_pk.id !== id
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    updateTechieActivity: async ({ techieID, year, week, type, value, edyoucatedImportedAt, edyoucatedNextImportAfter }) => {
      const data = await fetchQuery({
        query: mutations.fetch('UPDATE_TECHIE_ACTIVITY'),
        variables: { techieID, year, week, type, value, edyoucatedImportedAt, edyoucatedNextImportAfter }
      })

      if(
        !data.insert_techie_activity ||
        !('affected_rows' in data.insert_techie_activity) ||
        data.insert_techie_activity.affected_rows !== 1 ||
        !data.update_techies_by_pk ||
        !('id' in data.update_techies_by_pk) ||
        data.update_techies_by_pk.id !== techieID
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    getGSheetContent: async ({ folderID, name, sheetName }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_GSHEET_CONTENT'),
        variables: { folderID, name, sheetName }
      })

      if(
        !data.gsheet_content
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return JSON.parse(data.gsheet_content)
    },
    updateGSheetContent: async ({ folderID, name, sheetName, content }) => {
      const data = await fetchQuery({
        query: mutations.fetch('UPDATE_GSHEET_CONTENT'),
        variables: {
          contentJSON: JSON.stringify(content),
          folderID,
          name,
          sheetName
        }
      })

      if(
        !data.update_gsheet_content
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    getTechiesWithSlackMemberIDs: async ({ slackMemberIDs }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIES_WITH_SLACK_MEMBER_IDS'),
        variables: { slackMemberIDs }
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

      return data.techies
    },
    getLocationByName: async ({ name }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_LOCATION_BY_NAME'),
        variables: { name }
      })

      if(
        !data.locations ||
        !Array.isArray(data.locations)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.locations[0]
    },
    getTechieExportByLocation: async ({ name }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIE_EXPORT_BY_LOCATION'),
        variables: { name }
      })

      if(
        !data.techie_export ||
        !Array.isArray(data.techie_export)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.techie_export
    },
    getTechieAnonymousExport: async () => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIE_ANONYMOUS_EXPORT')
      })

      if(
        !data.techie_anonymous_export ||
        !Array.isArray(data.techie_anonymous_export)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.techie_anonymous_export
    },
    getTechieActivityReportsForSemester: async ({ semesterID }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIE_ACTIVITY_REPORTS_FOR_SEMESTER'),
        variables: { semesterID }
      })

      if(
        !data.techie_semester_activity_reports ||
        !Array.isArray(data.techie_semester_activity_reports)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.techie_semester_activity_reports
    },
    getTechiePendingExports: async () => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIE_PENDING_EXPORTS')
      })

      if(
        !data.techie_pending_exports ||
        !Array.isArray(data.techie_pending_exports)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.techie_pending_exports
    },
    getTechieSemesterActivityPendingExports: async () => {
      const data = await fetchQuery({
        query: queries.fetch('GET_TECHIE_SEMESTER_ACTIVITY_PENDING_EXPORTS')
      })

      if(
        !data.techie_semester_activity_pending_exports ||
        !Array.isArray(data.techie_semester_activity_pending_exports)
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.techie_semester_activity_pending_exports
    },
    updateExport: async ({ name, type, digest, exportedAt }) => {
      const data = await fetchQuery({
        query: mutations.fetch('UPDATE_EXPORT'),
        variables: {
          name,
          type,
          digest,
          exportedAt
        }
      })

      if(
        !data.insert_exports_one
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return
    },
    getSemesterByID: async ({ semesterID }) => {
      const data = await fetchQuery({
        query: queries.fetch('GET_SEMESTER_BY_ID'),
        variables: { semesterID }
      })

      if(
        !data.semesters_by_pk
      ) {
        return Promise.reject({
          reason: `GraphQL API responded with an invalid result`,
          error: data
        })
      }

      return data.semesters_by_pk
    },
    custom: fetchQuery,
  }
}
