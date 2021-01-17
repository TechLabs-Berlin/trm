const sinon = require('sinon')
const expect = require('chai').expect
const moment = require('moment')

const log = require('../util/logger')({
  debugLoggingEnabled: true
})
const newEventHandler = require('../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles events', async () => {
        const trmAPI = sinon.spy({
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
            id: 'SEMESTER_ID',
            starts_at: '2021-02-01T00:00:00',
            ends_at: '2021-03-01T00:00:00',
            techies: [{
              edyoucated_user_id: 'OTHER_EDYOUCATED_USER_ID'
            }]
          }),
          updateTechieEdyoucatedUserID: () => {},
          getTechiesPendingEdyoucatedImport: () => ([{
            id: 'TECHIE_ID',
            edyoucated_user_id: 'EDYOUCATED_ID',
            semester_id: 'SEMESTER_ID'
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
            { id: 'TECHIE_A', slack_member_id: 'SLACK_USER_A', semester_id: 'SEMESTER_ID' },
          ]),
          updateGSheetContent: () => {}
        })
        const handler = newEventHandler({
            buildTRMAPI: Promise.resolve(trmAPI),
            log
        })
        const now = moment.utc('2021-02-08T12:45:56+01:00')
        await handler.handle({ now })
        expect(trmAPI.updateTechieActivity.callCount).to.be.equal(3)
        expect(trmAPI.updateTechieActivity.getCall(0).args).to.eql([{
          techieID: 'TECHIE_ID',
          semesterID: 'SEMESTER_ID',
          semesterWeek: 1,
          type: 'edyoucated',
          edyoucatedImportedAt: '2021-02-08T11:45:56.000Z',
          edyoucatedNextImportAfter: '2021-02-08T19:45:56.000Z',
          value: 10
        }])
        expect(trmAPI.updateTechieActivity.getCall(1).args).to.eql([{
          techieID: 'TECHIE_A',
          semesterID: 'SEMESTER_ID',
          semesterWeek: 1,
          type: 'slack_activity',
          edyoucatedImportedAt: '2021-02-08T11:45:56.000Z',
          edyoucatedNextImportAfter: '2021-02-08T19:45:56.000Z',
          value: 11
        }])
        expect(trmAPI.updateTechieActivity.getCall(2).args).to.eql([{
          techieID: 'TECHIE_A',
          semesterID: 'SEMESTER_ID',
          semesterWeek: 1,
          type: 'slack_participation',
          edyoucatedImportedAt: '2021-02-08T11:45:56.000Z',
          edyoucatedNextImportAfter: '2021-02-08T19:45:56.000Z',
          value: 2
        }])
    })
  })
})
