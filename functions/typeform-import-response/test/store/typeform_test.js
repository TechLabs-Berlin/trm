const nock = require('nock')
const sinon = require('sinon')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const fetch = require('../../util/fetch')({ log })
const newTypeformStore = require('../../store/typeform')
const { expect } = require('chai')

const typeformBase = "https://api.typeform.com"
const typeformPath = "/forms/MYFORM/responses"

describe('store', () => {
  describe('typeform', () => {
    describe('getFormResponsesPaginated', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .get(`${typeformPath}?page_size=100`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'B' },
              { token: 'A' }
            ]
          })
        nock(typeformBase)
          .get(`${typeformPath}?page_size=100&after=B`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'C' },
              { token: 'D' }
            ]
          })
        nock(typeformBase)
          .get(`${typeformPath}?page_size=100&after=D`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: []
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('returns paginated form responses', async () => {
        const typeform = newTypeformStore({
          fetch,
          log
        })
        const callback = sinon.spy()
        await typeform.getFormResponsesPaginated({
          id: 'MYFORM',
          token: 'TOKEN',
          callback
        })
        expect(callback.callCount).to.equal(2)
        expect(callback.getCall(0).calledWithExactly([
          { token: 'B' },
          { token: 'A' }
        ])).to.be.true
        expect(callback.getCall(1).calledWithExactly([
          { token: 'C' },
          { token: 'D' }
        ])).to.be.true
      })
    })
  })
})
