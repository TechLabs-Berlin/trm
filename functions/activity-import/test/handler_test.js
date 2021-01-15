const log = require('../util/logger')({
  debugLoggingEnabled: true
})
const newEventHandler = require('../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles events', () => {
        const trmAPI = {
          getTechiesWithoutEdyoucatedUserID: () => ([
            {
              id: 'TECHIE_ID',
              first_name: 'First',
              last_name: 'Last',
              semester: {
                id: 'SEMESTER_ID',
                edyoucated_team_id: 'EDYOUCATED_TEAM_ID'
              }
            },
            {
              id: 'OTHER_TECHIE_ID',
              first_name: 'El Michaelang',
              last_name: 'Ramazotti',
              semester: {
                id: 'SEMESTER_ID',
                edyoucated_team_id: 'EDYOUCATED_TEAM_ID'
              }
            }
          ]),
          getEdyoucatedTeamMembers: () => ([{
            name: 'Michelangelo Ramazotti',
            id: 'EDYOUCATED_ID'
          }]),
          getSemesterByID: () => ({
            techies: [{
              edyoucated_user_id: 'OTHER_EDYOUCATED_USER_ID'
            }]
          }),
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
