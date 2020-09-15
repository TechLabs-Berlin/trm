const nock = require('nock')
const sinon = require('sinon')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const fetch = require('../../util/fetch')({ log })
const newTypeformStore = require('../../store/typeform')
const { expect } = require('chai')

const typeformBase = "https://api.typeform.com"
const responsesPath = "/forms/MYFORM/responses"
const webhookPath = "/forms/MYFORM/webhooks/trm"

describe('store', () => {
  describe('typeform', () => {
    describe('getFormResponsesPaginated', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'B' },
              { token: 'A' }
            ]
          })
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100&after=B`)
          .reply(200, {
            total_items: 3,
            page_count: 2,
            items: [
              { token: 'C' },
              { token: 'D' }
            ]
          })
        nock(typeformBase)
          .get(`${responsesPath}?page_size=100&after=D`)
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
    describe('checkWebhook', () => {
      describe('when already installed', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(typeformBase)
            .get(webhookPath)
            .reply(200, {
              "id": "01EJ6CRNNEJFX0FTXSN7WFY5V5",
              "form_id": "HFPjx8K0",
              "tag": "trm",
              "url": "https://example.invalid/tf-import-response-staging?op=one&formID=FORM_ID",
              "enabled": true,
              "verify_ssl": true,
              "secret": "SECRET",
              "created_at": "2020-09-14T13:27:15.887774Z",
              "updated_at": "2020-09-15T13:55:15.079961Z"
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns true', async () => {
          const typeform = newTypeformStore({
            fetch,
            log
          })
          const result = await typeform.checkWebhook({
            id: 'MYFORM',
            token: 'TOKEN',
          })
          expect(result).to.deep.equal({installed: true, url: 'https://example.invalid/tf-import-response-staging?op=one&formID=FORM_ID'})
        })
      })
      describe('when not installed', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(typeformBase)
            .get(webhookPath)
            .reply(404)
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns false', async () => {
          const typeform = newTypeformStore({
            fetch,
            log
          })
          const result = await typeform.checkWebhook({
            id: 'MYFORM',
            token: 'TOKEN',
          })
          expect(result).to.deep.equal({installed: false})
        })
      })
    })
    describe('updateWebhook', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(typeformBase)
          .put(webhookPath)
          .reply(200, {
            "id": "01EJ6CRNNEJFX0FTXSN7WFY5V5",
            "form_id": "HFPjx8K0",
            "tag": "trm",
            "url": "https://example.invalid",
            "enabled": true,
            "verify_ssl": true,
            "secret": "SECRET",
            "created_at": "2020-09-14T13:27:15.887774Z",
            "updated_at": "2020-09-15T14:18:19.278405Z"
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('works', () => {
        const typeform = newTypeformStore({
          fetch,
          log
        })
        return typeform.updateWebhook({
          id: 'MYFORM',
          callbackURL: 'https://example.invalid',
          secret: 'SECRET',
          token: 'TOKEN',
        })
      })
    })
  })
})
