const fs = require('fs')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const newEventHandler = require('../../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles hasura events', () => {
        const trmAPI = {
          getForm: () => {
            return {
              location: 'BERLIN',
              semester: 'S_2020_02',
              imports_techies: true
            }
          },
          findTechieByID: () => {return {found: false}},
          findTechieByEmail: () => {return {found: false}},
          findTechieByTechieKey: () => {return {found: false}},
          createTechie: () => {return {id: 'TECHIE_ID'}},
          associateTechieWithFormResponse: () => undefined,
          updateTechieMasterData: () => undefined
        }
        const handler = newEventHandler({
            buildTRMAPI: Promise.resolve(trmAPI),
            log
        })
        return handler.handle({
            payload: JSON.parse(fs.readFileSync('test/fixtures/event.json', 'utf8'))
        })
    })
  })
})
