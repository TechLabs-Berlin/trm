const log = require('../util/logger')({
  debugLoggingEnabled: false
})
const newEventHandler = require('../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles events', () => {
        const trmAPI = {
          getTechiesWithoutEdyoucatedUserID: () => ([
            {
              id: 'TECHIE_ID',
              edyoucated_handle: 'EDYOUCATED_HANDLE_THAT_EXISTS'
            },
            {
              id: 'OTHER_TECHIE_ID',
              edyoucated_handle: 'EDYOUCATED_HANDLE_THAT_IS_MISSING'
            }
          ]),
          getEdyoucatedUsers: () => ([{
            username: 'EDYOUCATED_HANDLE_THAT_EXISTS',
            id: 'EDYOUCATED_ID'
          }]),
          updateTechieEdyoucatedUserID: () => {},
          getTechiesPendingEdyoucatedImport: () => ([{
            id: 'TECHIE_ID',
            edyoucated_user_id: 'EDYOUCATED_ID'
          }]),
          getEdyoucatedActivity: () => ([{
            id: 'EDYOUCATED_ID',
            value: 10
          }]),
          updateTechieActivity: () => {},
          getGSheetContent: () => ([
            { 'User ID': 'SLACK_USER_A', 'Days active': '11', 'Messages posted': '2' },
            { 'User ID': 'SLACK_USER_B', 'Days active': '2', 'Messages posted': '0' },
          ]),
          getTechiesWithSlackMemberIDs: () => ([
            { id: 'TECHIE_A', slack_member_id: 'SLACK_USER_A' },
          ]),
          updateGSheetContent: () => {}
        }
        const handler = newEventHandler({
            buildTRMAPI: Promise.resolve(trmAPI),
            log
        })
        return handler.handle()
    })
  })
})
