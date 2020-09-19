const expect = require('chai').expect
const response = require('../../handler/response')

describe('response handler', () => {
  describe('isUUID', () => {
    it('returns true for a valid UUID', () => {
      expect(response.isUUID('3889c213-a1af-4cab-8a2c-c39533b2482d')).to.be.true
    })
    it('returns false for an invalid UUID', () => {
      expect(response.isUUID('mood')).to.be.false
    })
  })

  describe('getAnswer', () => {
    it('handles text', () => {
      const answer = response.getAnswer({
        "text": "short",
        "type": "text",
        "field.id": "yPS1mB8dnWRq",
        "field": {
          "id": "yPS1mB8dnWRq",
          "ref": "short_text",
          "type": "short_text"
        }
      })
      expect(answer).to.deep.equal({
        type: 'text',
        value: 'short'
      })
    })
    it('handles choice', () => {
      const answer = response.getAnswer({
        "type": "choice",
        "field.id": "beVzYxjPMwxf",
        "field": {
          "id": "beVzYxjPMwxf",
          "ref": "multiple_choice",
          "type": "multiple_choice"
        },
        "choice": {
          "label": "a"
        }
      })
      expect(answer).to.deep.equal({
        type: 'choice',
        value: 'a'
      })
    })
    it('handles choice', () => {
      const answer = response.getAnswer({
        "type": "choices",
        "field.id": "sTcMXnwUOebD",
        "field": {
          "id": "sTcMXnwUOebD",
          "ref": "multiple_choice_multiple",
          "type": "multiple_choice"
        },
        "choices": {
          "labels": ["a"]
        }
      })
      expect(answer).to.deep.equal({
        type: 'choices',
        value: ['a']
      })
    })
    it('handles phone_number', () => {
      const answer = response.getAnswer({
        "type": "phone_number",
        "field.id": "ZyOfowtJMIyW",
        "field": {
          "id": "ZyOfowtJMIyW",
          "ref": "phone",
          "type": "phone_number"
        },
        "phone_number": "+49172438284342"
      })
      expect(answer).to.deep.equal({
        type: 'phone_number',
        value: '+49172438284342'
      })
    })
    it('handles boolean', () => {
      const answer = response.getAnswer({
        "type": "boolean",
        "field.id": "LdsMCAvwDHgr",
        "field": {
          "id": "LdsMCAvwDHgr",
          "ref": "yes_no",
          "type": "yes_no"
        },
        "boolean": true
      })
      expect(answer).to.deep.equal({
        type: 'boolean',
        value: true
      })
    })
    it('handles number', () => {
      const answer = response.getAnswer({
        "type": "number",
        "field.id": "51lpwXDdkQwE",
        "field": {
          "id": "51lpwXDdkQwE",
          "ref": "opinion",
          "type": "opinion_scale"
        },
        "number": 3
      })
      expect(answer).to.deep.equal({
        type: 'number',
        value: 3
      })
    })
    it('handles date', () => {
      const answer = response.getAnswer({
        "date": "2020-09-14",
        "type": "date",
        "field.id": "LsckiGbsrdTG",
        "field": {
          "id": "LsckiGbsrdTG",
          "ref": "date",
          "type": "date"
        }
      })
      expect(answer).to.deep.equal({
        type: 'date',
        value: '2020-09-14'
      })
    })
    it('handles file_url', () => {
      const answer = response.getAnswer({
        "type": "file_url",
        "field.id": "LnFHiVkPb039",
        "field": {
          "id": "LnFHiVkPb039",
          "ref": "file",
          "type": "file_upload"
        },
        "file_url": "https://api.typeform.com/responses/files/15af3cbd5028bbeafc376ca0dad339873ea47ebd9b56a85926834bc27ccda9f3/config.staging_5.js"
      })
      expect(answer).to.deep.equal({
        type: 'file_url',
        value: 'https://api.typeform.com/responses/files/15af3cbd5028bbeafc376ca0dad339873ea47ebd9b56a85926834bc27ccda9f3/config.staging_5.js'
      })
    })
    it('handles url', () => {
      const answer = response.getAnswer({
        "url": "https://techlabs.org",
        "type": "url",
        "field.id": "X8e9H6Fod6Lx",
        "field": {
          "id": "X8e9H6Fod6Lx",
          "ref": "website",
          "type": "website"
        }
      })
      expect(answer).to.deep.equal({
        type: 'url',
        value: 'https://techlabs.org'
      })
    })
    it('handles other', () => {
      const answer = response.getAnswer({
        "fancy": 3.14,
        "type": "some_new",
        "field.id": "X8e9H6Fod6Lx",
        "field": {
          "id": "X8e9H6Fod6Lx",
          "ref": "pi",
          "type": "some_new"
        }
      })
      expect(answer).to.be.null
    })
  })

  describe('getResponse', () => {
    it('copies the response into the answers field for every field with a non-UUID as ref', () => {
      const resp = response.getResponse({
        typeformResponseToken: '0tu5dow00gadadccm0tu5dbz1sqma4vp',
        typeformEvent: {},
        answers: formResponse.answers,
        fields: formResponse.definition.fields,
        formID: '3889c213-a1af-4cab-8a2c-c39533b2482d'
      })

      expect(resp.answers).to.deep.equal({
        "mood": {
          "index": 0,
          "title": "Hi, how are you?",
          "type": "text",
          "value": "Still fine."
        },
        "picture_choice": {
          "index": 2,
          "type": "choice",
          "value": "a"
        }
      })
    })
  })
})

const formResponse = {
  "token": "0tu5dow00gadadccm0tu5dbz1sqma4vp",
  "answers": [
    {
      "text": "Still fine.",
      "type": "text",
      "field": {
        "id": "yPS1mB8dnWRq",
        "ref": "mood",
        "type": "short_text"
      }
    },
    {
      "text": "Random new Answer",
      "type": "text",
      "field": {
        "id": "PO0SlwNprfRx",
        "ref": "3889c213-a1af-4cab-8a2c-c39533b2482d",
        "type": "short_text"
      }
    },
    {
      "type": "choice",
      "field.id": "bJIbXD6x7til",
      "field": {
        "id": "bJIbXD6x7til",
        "ref": "picture_choice",
        "type": "picture_choice"
      },
      "choice": {
        "label": "a"
      }
    }
  ],
  "form_id": "HFPjx8K0",
  "landed_at": "2020-09-14T13:34:21Z",
  "definition": {
    "id": "HFPjx8K0",
    "title": "TRM Import Test",
    "fields": [
      {
        "id": "yPS1mB8dnWRq",
        "ref": "mood",
        "type": "short_text",
        "title": "Hi, how are you?",
        "properties": {}
      },
      {
        "id": "PO0SlwNprfRx",
        "ref": "3889c213-a1af-4cab-8a2c-c39533b2482d",
        "type": "short_text",
        "title": "Random new Question",
        "properties": {}
      }
    ]
  }
}
