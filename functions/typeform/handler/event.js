const generator = require('../util/generator')
const callbackUtil = require('../util/callback')
const responseHandler = require('../handler/response')

const tableName = 'forms'

module.exports = ({hasura, typeform, functionURL, log}) => {
  return {
    // see https://developer.typeform.com/webhooks/example-payload/
    handleOne: async ({formID, payload}) => {
      const id = payload.event_id

      log.info(`Received event ${id}`, { type: 'one', id })
      log.debug('Event details', { type: 'one', id, payload })

      if(payload.event_type !== 'form_response') {
        log.info(`unsupported event type ${payload.event_type}`, { type: 'one', id })
        return Promise.reject(`Unsupported event type ${payload.event_type}`)
      }

      const response = payload.form_response
      if(!response) {
        return Promise.reject('Payload does not contain form_response')
      }

      const { token } = response
      if(!token) {
        return Promise.reject('form_response does not contain token')
      }

      const form = await hasura.getForm({ id: formID })
      const formSubmissionExists = await hasura.doesFormSubmissionExist({
        typeformResponseToken: token,
        formID
      })

      if(formSubmissionExists) {
        log.info(`Form submission with token ${token} exists, ignoring`, { type: 'one', id })
        return
      }

      const formSubmissionID = await hasura.createFormSubmission(
        responseHandler.getResponse({
          typeformResponseToken: token,
          typeformEvent: payload,
          response,
          formID
        })
      )

      if(!form.imports_techies) {
        return
      }

      const techieID = await hasura.createTechie({
        location: form.location,
        semester: 'S_2020_02', // TODO make dynamic
        state: 'APPLICANT',
        techieKey: generator.generateTechieKey()
      })

      await hasura.associateTechieWithFormSubmission({
        techieID,
        formSubmissionID
      })
    },

    handleAll: async ({payload}) => {
      const { id } = payload

      log.info(`Received event ${id}`, { type: 'all', id })
      log.debug(`Event details`, { type: 'all', id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { type: 'all', id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }
      const newState = payload.event.data.new
      const typeformToken = await hasura.getTypeformToken({ location: newState.location })
      const webhookCallbackURL = callbackUtil.createFullCallbackURL({
        formID: newState.uuid,
        callbackURL: functionURL
      })

      let webhookNeedsUpdate = false

      if(!newState.webhook_installed_at) {
        webhookNeedsUpdate = true
      }
      if(!webhookNeedsUpdate) {
        const existingWebhook = await typeform.checkWebhook({
          id: newState.form_id,
          token: typeformToken
        })
        if(!existingWebhook.installed) {
          webhookNeedsUpdate = true
        } else if(existingWebhook.url !== webhookCallbackURL) {
          webhookNeedsUpdate = true
        }
      }
      if(!webhookNeedsUpdate) {
        log.info('Webhook doesn\'t need update', { id })
      } else {
        await typeform.updateWebhook({
          id: newState.form_id,
          callbackURL: webhookCallbackURL,
          secret: newState.secret,
          token: typeformToken
        })
      }

      await typeform.getFormResponsesPaginated({
        id: newState.form_id,
        token: typeformToken,
        callback: async (responses) => {
          const typeformResponseTokens = responses.map(r => r.token)
          const existingTypeformResponseTokens = await hasura.getExistingTypeformResponseTokensForForm({
            formID: newState.uuid,
            typeformResponseTokens
          })
          const newTypeformResponseTokens = typeformResponseTokens.filter(t => !existingTypeformResponseTokens.includes(t))
          log.debug(`Found ${newTypeformResponseTokens.length} new responses, importing`, { type: 'all', id })
          for(const typeformResponseToken of newTypeformResponseTokens) {
            const response = responses.find(r => r.token === typeformResponseToken)
            if(!response) {
              log.warning(`Expected to find response with token ${typeformResponseToken} but didn't`, { type: 'all', id })
              continue
            }
            const formSubmissionID = await hasura.createFormSubmission(
              responseHandler.getResponse({
                typeformEvent: response,
                formID: newState.uuid,
                typeformResponseToken,
                response
              })
            )
            log.debug(`Created form submission ${formSubmissionID}`, { id })
          }
        }
      })
    }
  }
}
