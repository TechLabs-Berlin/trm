const fs = require('fs')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const newEventHandler = require('../../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles hasura events', () => {
        const hasura = {
          getForm: () => {
            return {
              location: 'BERLIN',
              semester: 'S_2020_02',
              imports_techies: true
            }
          },
          findTechieByEmail: () => null,
          findTechieByTechieKey: () => null,
          createTechie: () => 'TECHIE_ID',
          associateTechieWithFormSubmission: () => undefined
        }
        const handler = newEventHandler({
            hasura,
            log
        })
        return handler.handle({
            payload: JSON.parse(fs.readFileSync('test/fixtures/event.json', 'utf8'))
        })
    })
  })
})
