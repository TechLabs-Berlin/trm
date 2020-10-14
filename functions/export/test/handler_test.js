const log = require('../util/logger')({
  debugLoggingEnabled: false
})
const newEventHandler = require('../handler/event')

describe('event handler', () => {
  describe('handle', () => {
    it('handles events', () => {
        const trmAPI = {
          getTechiePendingExports: () => ([
            { name: 'techies', type: 'anonymous', digest: 'A_DIGEST'},
            { name: 'techies', type: 'BERLIN', digest: 'B_DIGEST'},
          ]),
          getTechieAnonymousExport: () => ([
            { col: 'row' },
            { col: 'row 2'}
          ]),
          getLocationByName: () => ({
            export_folder_id: 'FOLDER_ID'
          }),
          getTechieExportByLocation: () => ([
            { col: 'row' },
            { col: 'row 2'}
          ]),
          updateGSheetContent: () => {},
          updateExport: () => {},
          getTechieSemesterActivityPendingExports: () => ([
            { name: 'techie_semester_activity', type: 'A_UUID', digest: 'A_DIGEST'},
            { name: 'techie_semester_activity', type: 'B_UUID', digest: 'B_DIGEST'}
          ]),
          getSemesterByID: () => ({
            locationByLocation: {
              export_folder_id: 'FOLDER_ID'
            }
          }),
          getTechieActivityReportsForSemester: () => ([
            { col: 'row' },
            { col: 'row 2'}
          ])
        }
        const handler = newEventHandler({
            buildTRMAPI: Promise.resolve(trmAPI),
            log
        })
        return handler.handle()
    })
  })
})
