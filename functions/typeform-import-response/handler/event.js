const generator = require('../util/generator')
const responseHandler = require('../handler/response')

module.exports = ({hasura, log}) => {
  return {
    // see https://developer.typeform.com/webhooks/example-payload/
    handleEvent: async ({formID, payload}) => {
      const id = payload.event_id

      log.info(`Received event ${id}`, { id })
      log.debug('Event details', { id, payload })

      if(payload.event_type !== 'form_response') {
        log.info(`unsupported event type ${payload.event_type}`, { id })
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
        log.info(`Form submission with token ${token} exists, ignoring`, { id })
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
    }
  }
}
