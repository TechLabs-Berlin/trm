const nock = require('nock')
const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const fetch = require('../../util/fetch')({ log })
const newHasuraStore = require('../../store/hasura')
const { expect } = require('chai')

const graphqlBase = "http://api.invalid"
const graphqlPath = "/v1/graphql"
const graphqlURL = `${graphqlBase}${graphqlPath}`
const token = "TOKEN"

describe('store', () => {
  describe('hasura', () => {
    describe('getForm', () => {
      describe('form exists', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "forms": [
                  {
                    "id": "460eceba-f40a-11ea-9986-0242c0a85002",
                    "created_at": "2020-09-11T08:39:15.021875",
                    "description": "Test Form 2",
                    "form_id": "b138yZof",
                    "imports_techies": true,
                    "location": "BERLIN",
                    "secret": "SECRET",
                    "updated_at": "2020-09-11T08:39:15.021875",
                    "webhook_installed_at": "2020-09-13T15:20:59.181605"
                  }
                ]
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns the form', async () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const form = await hasura.getForm('460eceba-f40a-11ea-9986-0242c0a85002')
          expect(form).to.include.all.keys(['id', 'created_at', 'description'])
        })
      })
      describe('form does not exist', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "forms": []
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('rejects', () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          return hasura.getForm('460eceba-f40a-11ea-9986-0242c0a85002')
            .then(
              () => Promise.reject(new Error('expected rejected promise')),
              () => true
            )
        })
      })
    })
    describe('doesFormSubmissionExist', () => {
      describe('submission exists', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "form_submissions": [
                  {
                    "id": "460eceba-f40a-11ea-9986-0242c0a85002",
                  }
                ]
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns true', async () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.doesFormSubmissionExist('460eceba-f40a-11ea-9986-0242c0a85002', 'RESPONSE_TOKEN')
          expect(result).to.be.true
        })
      })
      describe('form submission does not exist', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "form_submissions": []
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('returns false', async () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.doesFormSubmissionExist('460eceba-f40a-11ea-9986-0242c0a85002', 'RESPONSE_TOKEN')
          expect(result).to.be.false
        })
      })
    })
    describe('createFormSubmission', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "insert_form_submissions_one": {
                "id": "a017fed8-f67e-11ea-a52d-0242c0a85002"
              }
            }
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('returns the ID', async () => {
        const hasura = newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        const result = await hasura.createFormSubmission({
          formID: "460eceba-f40a-11ea-9986-0242c0a85002",
          typeformResponseToken: 'RESPONSE_TOKEN',
          typeformEvent: {some: 'data'},
          answers: {some_other: 'information'}
        })
        expect(result).to.be.a('string')
      })
    })
    describe('createTechie', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "insert_techies_one": {
                "id": "13dc8930-f682-11ea-a595-0242c0a85002"
              }
            }
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('returns the ID', async () => {
        const hasura = newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        const result = await hasura.createTechie({
          location: 'BERLIN',
          semester: 'S_2020_01',
          state: 'APPLICANT',
          techieKey: 'hamster123'
        })
        expect(result).to.be.a('string')
      })
    })
    describe('associateTechieWithFormSubmission', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "update_form_submissions_by_pk": {
                "id": "a017fed8-f67e-11ea-a52d-0242c0a85002"
              }
            }
          })
        done()
      })

      after(() => {
        expect(nock.isDone()).to.be.true
        nock.cleanAll()
        nock.enableNetConnect()
      })

      it('works', () => {
        const hasura = newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        return hasura.associateTechieWithFormSubmission({
          techieID: "13dc8930-f682-11ea-a595-0242c0a85002",
          formSubmissionID: "a017fed8-f67e-11ea-a52d-0242c0a85002"
        })
      })
      describe('getTypeformToken', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "typeform_users": [
                  {
                    "token": "TFTOKEN"
                  }
                ]
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('works', async () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.getTypeformToken({
            formID: "FORM_ID"
          })
          expect(result).to.equal('TFTOKEN')
        })
      })
      describe('getExistingTypeformResponseTokensForForm', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "form_submissions": [
                  {
                    "typeform_response_token": "lk00m5eq3j3wff5ngp3lk00m8mbh2zzc"
                  }
                ]
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('works', async () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.getExistingTypeformResponseTokensForForm({
            formID: "FORM_ID"
          })
          expect(result).to.deep.equal(['lk00m5eq3j3wff5ngp3lk00m8mbh2zzc'])
        })
      })
      describe('setWebhookInstalledAt', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "update_forms": {
                  "affected_rows": 1
                }
              }
            })
          done()
        })

        after(() => {
          expect(nock.isDone()).to.be.true
          nock.cleanAll()
          nock.enableNetConnect()
        })

        it('works', () => {
          const hasura = newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          return hasura.setWebhookInstalledAt({
            formID: "FORM_ID"
          })
        })
      })
    })
  })
})
