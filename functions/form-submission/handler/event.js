const generator = require('../util/generator')

const tableName = 'form_submissions'

module.exports = ({hasura, log}) => {
  return {
    handle: async ({payload}) => {
      const { id } = payload

      log.info(`Received event ${id}`, { id })
      log.debug(`Event details`, { id, payload })

      if(payload.table.name !== tableName) {
        log.info(`Event doesn't belong to ${tableName}, ignoring`, { id })
        return Promise.reject(`Event doesn't belong to ${tableName}`)
      }

      const newState = payload.event.data.new
      const form = await hasura.getForm({ id: newState.form_uuid })

      let techieID = null
      if('email' in newState.answers) {
        const result = await hasura.findTechieByEmail({
          location: form.location,
          semester: form.semester,
          email: newState.answers.email.value
        })
        if(result.found) {
          techieID = result.techie.id
        }
      }
      if(techieID === null && ('techie_key' in newState.answers)) {
        const result = await hasura.findTechieByTechieKey({
          location: form.location,
          semester: form.semester,
          techieKey: newState.answers.techie_key.value
        })
        if(result.found) {
          techieID = result.techie.id
        }
      }
      if(techieID === null && form.imports_techies && !newState.techie_uuid) {
        techieID = await hasura.createTechie({
          location: form.location,
          semester: form.semester,
          state: 'APPLICANT',
          techieKey: generator.generateTechieKey()
        })
      }

      if(techieID !== null) {
        await hasura.associateTechieWithFormSubmission({
          formSubmissionID: newState.uuid,
          techieID
        })
      }
    }
  }
}
