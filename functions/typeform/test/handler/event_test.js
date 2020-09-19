const log = require('../../util/logger')({
  debugLoggingEnabled: false
})
const newEventHandler = require('../../handler/event')

describe('event handler', () => {
  describe('handleOne', () => {
    it('handles typeform form_response events', () => {
        const hasura = {
            getForm: () => {
            return {
                "id": "14c3bc2a-f67c-11ea-a595-0242c0a85002",
                "webhook_installed_at": null,
                "updated_at": "2020-09-14T11:18:57.295439",
                "typeform_secret": "14c3bd7e-f67c-11ea-a595-0242c0a85002",
                "location": "BERLIN",
                "imports_techies": false,
                "typeform_id": "",
                "created_at": "2020-09-14T11:18:57.295439",
                "description": null
            }
            },
            doesFormResponseExist: () => false,
            createFormResponse: () => 'a017fed8-f67e-11ea-a52d-0242c0a85002',
            createTechie: () => '13dc8930-f682-11ea-a595-0242c0a85002',
            associateTechieWithFormResponse: () => undefined
        }
        const handler = newEventHandler({
            hasura,
            log
        })
        return handler.handleOne({
            formID: '',
            payload: onePayload
        })
    })
  })

  describe('handleAll', () => {
      it('handles hasura events', () => {
          const hasura = {
            getTypeformToken: () => 'TOKEN',
            getExistingTypeformResponseTokensForForm: () => ['token2'],
            createFormResponse: () => 'UUID',
            setWebhookInstalledAt: () => undefined
          }
          const typeform = {
            getFormResponsesPaginated: ({id, token, callback}) => callback([
                { token: 'token1', answers: [] },
                { token: 'token2', answers: [] }
            ]),
            checkWebhook: () => {
                return { installed: false }
            },
            updateWebhook: () => undefined
          }
          const handler = newEventHandler({
              hasura,
              typeform,
              log
          })
          return handler.handleAll({
              payload: allPayload
          })
      })
  })
})

// Sample payload from https://developer.typeform.com/webhooks/example-payload/
const onePayload = JSON.parse(`
{
  "event_id": "LtWXD3crgy",
  "event_type": "form_response",
  "form_response": {
      "form_id": "lT4Z3j",
      "token": "a3a12ec67a1365927098a606107fac15",
      "submitted_at": "2018-01-18T18:17:02Z",
      "landed_at": "2018-01-18T18:07:02Z",
      "calculated": {
          "score": 9
      },
      "definition": {
          "id": "lT4Z3j",
          "title": "Webhooks example",
          "fields": [
              {
                  "id": "DlXFaesGBpoF",
                  "title": "Thanks, {{answer_60906475}}! What's it like where you live? Tell us in a few sentences.",
                  "type": "long_text",
                  "ref": "[readable_ref_long_text",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "SMEUb7VJz92Q",
                  "title": "If you're OK with our city management following up if they have further questions, please give us your email address.",
                  "type": "email",
                  "ref": "readable_ref_email",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "JwWggjAKtOkA",
                  "title": "What is your first name?",
                  "type": "short_text",
                  "ref": "readable_ref_short_text",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "KoJxDM3c6x8h",
                  "title": "When did you move to the place where you live?",
                  "type": "date",
                  "ref": "readable_ref_date",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "PNe8ZKBK8C2Q",
                  "title": "Which pictures do you like? You can choose as many as you like.",
                  "type": "picture_choice",
                  "ref": "readable_ref_picture_choice",
                  "allow_multiple_selections": true,
                  "allow_other_choice": false
              },
              {
                  "id": "Q7M2XAwY04dW",
                  "title": "On a scale of 1 to 5, what rating would you give the weather in Sydney? 1 is poor weather, 5 is excellent weather",
                  "type": "number",
                  "ref": "readable_ref_number1",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "gFFf3xAkJKsr",
                  "title": "By submitting this form, you understand and accept that we will share your answers with city management. Your answers will be anonymous will not be shared.",
                  "type": "legal",
                  "ref": "readable_ref_legal",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "k6TP9oLGgHjl",
                  "title": "Which of these cities is your favorite?",
                  "type": "multiple_choice",
                  "ref": "readable_ref_multiple_choice",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "RUqkXSeXBXSd",
                  "title": "Do you have a favorite city we haven't listed?",
                  "type": "yes_no",
                  "ref": "readable_ref_yes_no",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "NRsxU591jIW9",
                  "title": "How important is the weather to your opinion about a city? 1 is not important, 5 is very important.",
                  "type": "opinion_scale",
                  "ref": "readable_ref_opinion_scale",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "WOTdC00F8A3h",
                  "title": "How would you rate the weather where you currently live? 1 is poor weather, 5 is excellent weather.",
                  "type": "rating",
                  "ref": "readable_ref_rating",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              },
              {
                  "id": "pn48RmPazVdM",
                  "title": "On a scale of 1 to 5, what rating would you give the general quality of life in Sydney? 1 is poor, 5 is excellent",
                  "type": "number",
                  "ref": "readable_ref_number2",
                  "allow_multiple_selections": false,
                  "allow_other_choice": false
              }
          ]
      },
      "answers": [
          {
              "type": "text",
              "text": "It's cold right now! I live in an older medium-sized city with a university. Geographically, the area is hilly.",
              "field": {
                  "id": "DlXFaesGBpoF",
                  "type": "long_text"
              }
          },
          {
              "type": "email",
              "email": "laura@example.com",
              "field": {
                  "id": "SMEUb7VJz92Q",
                  "type": "email"
              }
          },
          {
              "type": "text",
              "text": "Laura",
              "field": {
                  "id": "JwWggjAKtOkA",
                  "type": "short_text"
              }
          },
          {
              "type": "date",
              "date": "2005-10-15",
              "field": {
                  "id": "KoJxDM3c6x8h",
                  "type": "date"
              }
          },
          {
              "type": "choices",
              "choices": {
                  "labels": [
                      "London",
                      "Sydney"
                  ]
              },
              "field": {
                  "id": "PNe8ZKBK8C2Q",
                  "type": "picture_choice"
              }
          },
          {
              "type": "number",
              "number": 5,
              "field": {
                  "id": "Q7M2XAwY04dW",
                  "type": "number"
              }
          },
          {
              "type": "boolean",
              "boolean": true,
              "field": {
                  "id": "gFFf3xAkJKsr",
                  "type": "legal"
              }
          },
          {
              "type": "choice",
              "choice": {
                  "label": "London"
              },
              "field": {
                  "id": "k6TP9oLGgHjl",
                  "type": "multiple_choice"
              }
          },
          {
              "type": "boolean",
              "boolean": false,
              "field": {
                  "id": "RUqkXSeXBXSd",
                  "type": "yes_no"
              }
          },
          {
              "type": "number",
              "number": 2,
              "field": {
                  "id": "NRsxU591jIW9",
                  "type": "opinion_scale"
              }
          },
          {
              "type": "number",
              "number": 3,
              "field": {
                  "id": "WOTdC00F8A3h",
                  "type": "rating"
              }
          },
          {
              "type": "number",
              "number": 4,
              "field": {
                  "id": "pn48RmPazVdM",
                  "type": "number"
              }
          }
      ]
  }
}
`)

const allPayload = JSON.parse(`
{
    "event": {
        "session_variables": {
            "x-hasura-role": "admin"
        },
        "op": "UPDATE",
        "data": {
            "old": {
                "typeform_id": "HFPjx8K0",
                "imports_techies": true,
                "location": "BERLIN",
                "id": "a78a7290-f68d-11ea-972a-42010a9c0ff0",
                "webhook_installed_at": "2020-09-14T13:31:47.309937",
                "typeform_secret": "SECRET",
                "updated_at": "2020-09-14T13:24:44.954927",
                "created_at": "2020-09-14T13:24:44.954927",
                "description": "TRM Import Test"
            },
            "new": {
                "typeform_id": "HFPjx8K0",
                "imports_techies": true,
                "location": "BERLIN",
                "id": "a78a7290-f68d-11ea-972a-42010a9c0ff0",
                "webhook_installed_at": "2020-09-14T13:33:38.450266",
                "typeform_secret": "SECRET",
                "updated_at": "2020-09-14T13:24:44.954927",
                "created_at": "2020-09-14T13:24:44.954927",
                "description": "TRM Import Test"
            }
        },
        "trace_context": {
            "trace_id": 707207211483485000,
            "span_id": 17760883705472678000
        }
    },
    "created_at": "2020-09-14T13:33:38.450266Z",
    "id": "68ade6e1-8be4-4e8a-85e7-a8153c9fb6ea",
    "delivery_info": {
        "max_retries": 3,
        "current_retry": 0
    },
    "trigger": {
        "name": "typeform-webhook"
    },
    "table": {
        "schema": "public",
        "name": "forms"
    }
}
`)
