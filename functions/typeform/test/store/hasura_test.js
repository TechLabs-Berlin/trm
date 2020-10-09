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
                    "typeform_id": "b138yZof",
                    "imports_techies": true,
                    "location": "BERLIN",
                    "typeform_secret": "SECRET",
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
          const hasura = await newHasuraStore({
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

        it('rejects', async () => {
          const hasura = await newHasuraStore({
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
    describe('doesFormResponseExist', () => {
      describe('response exists', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "form_responses": [
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
          const hasura = await newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.doesFormResponseExist('460eceba-f40a-11ea-9986-0242c0a85002', 'RESPONSE_TOKEN')
          expect(result).to.be.true
        })
      })
      describe('form response does not exist', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "form_responses": []
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
          const hasura = await newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.doesFormResponseExist('460eceba-f40a-11ea-9986-0242c0a85002', 'RESPONSE_TOKEN')
          expect(result).to.be.false
        })
      })
    })
    describe('createFormResponse', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "insert_form_responses_one": {
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
        const hasura = await newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        const result = await hasura.createFormResponse({
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
        const hasura = await newHasuraStore({
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
        expect(result).to.be.a('object')
      })
    })
    describe('associateTechieWithFormResponse', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "update_form_responses_by_pk": {
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

      it('works', async () => {
        const hasura = await newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        return hasura.associateTechieWithFormResponse({
          techieID: "13dc8930-f682-11ea-a595-0242c0a85002",
          formResponseID: "a017fed8-f67e-11ea-a52d-0242c0a85002"
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
          const hasura = await newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.getTypeformToken({
            location: "BERLIN"
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
                "form_responses": [
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
          const hasura = await newHasuraStore({
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

        it('works', async () => {
          const hasura = await newHasuraStore({
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
      describe('findTechieByEmail', () => {
        describe('if techie exists', () => {
          before((done) => {
            nock.disableNetConnect()
            nock(graphqlBase)
              .post(graphqlPath)
              .reply(200, {
                "data": {
                  "techies_by_pk": {
                    "created_at": "2020-09-15T19:18:41.364654",
                    "email": null,
                    "first_name": null,
                    "id": "43d66dca-f788-11ea-b03c-42010a9c0ff0",
                    "last_name": null,
                    "location": "BERLIN",
                    "semester": "S_2020_02",
                    "state": "APPLICANT",
                    "techie_key": "Esteban_Lebsack85",
                    "updated_at": "2020-09-15T19:18:41.364654"
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

          it('works', async () => {
            const hasura = await newHasuraStore({
              graphqlURL,
              token,
              fetch,
              log
            })
            const result = await hasura.findTechieByID({
              id: '43d66dca-f788-11ea-b03c-42010a9c0ff0'
            })
            expect(result.found).to.be.true
            expect(result.techie).to.deep.equal({
              "created_at": "2020-09-15T19:18:41.364654",
              "email": null,
              "first_name": null,
              "id": "43d66dca-f788-11ea-b03c-42010a9c0ff0",
              "last_name": null,
              "location": "BERLIN",
              "semester": "S_2020_02",
              "state": "APPLICANT",
              "techie_key": "Esteban_Lebsack85",
              "updated_at": "2020-09-15T19:18:41.364654"
            })
          })
        })
        describe('if techie does not exist', () => {
          before((done) => {
            nock.disableNetConnect()
            nock(graphqlBase)
              .post(graphqlPath)
              .reply(200, {
                "data": {
                  "techies_by_pk": null
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
            const hasura = await newHasuraStore({
              graphqlURL,
              token,
              fetch,
              log
            })
            const result = await hasura.findTechieByID({
              id: '43d66dca-f788-11ea-b03c-42010a9c0ff0'
            })
            expect(result.found).to.be.false
            expect(result.techie).not.to.exist
          })
        })
      })
      describe('findTechieByTechieKey', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "techies": [
                  {
                    "id": "b6b2bcea-f68e-11ea-a653-42010a9c0ff0"
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
          const hasura = await newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          const result = await hasura.findTechieByTechieKey({
            location: 'BERLIN',
            semester: 'S_2020_01',
            techieKey: 'Sandra123'
          })
          expect(result).to.deep.equal({found: true, techie: {id: 'b6b2bcea-f68e-11ea-a653-42010a9c0ff0'}})
        })
      })
    })
    describe('findTechieByEmail', () => {
      before((done) => {
        nock.disableNetConnect()
        nock(graphqlBase)
          .post(graphqlPath)
          .reply(200, {
            "data": {
              "techies": [
                {
                  "id": "b6b2bcea-f68e-11ea-a653-42010a9c0ff0"
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
        const hasura = await newHasuraStore({
          graphqlURL,
          token,
          fetch,
          log
        })
        const result = await hasura.findTechieByEmail({
          location: 'BERLIN',
          semester: 'S_2020_01',
          email: 'sandra@mail.net'
        })
        expect(result).to.deep.equal({found: true, techie: {id: 'b6b2bcea-f68e-11ea-a653-42010a9c0ff0'}})
      })
      describe('updateTechieMasterData', () => {
        before((done) => {
          nock.disableNetConnect()
          nock(graphqlBase)
            .post(graphqlPath)
            .reply(200, {
              "data": {
                "update_techies_by_pk": {
                  "id": "b6b2bcea-f68e-11ea-a653-42010a9c0ff0"
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

        it('works', async () => {
          const hasura = await newHasuraStore({
            graphqlURL,
            token,
            fetch,
            log
          })
          return hasura.updateTechieMasterData({
            id: "b6b2bcea-f68e-11ea-a653-42010a9c0ff0",
            email: "mail.de",
            firstName: "Hans",
            lastName: "Wurst",
            state: "APPLICANT",
            techieKey: "Hands33"
          })
        })
      })
    })
  })
})
