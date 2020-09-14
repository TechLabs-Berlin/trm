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
  describe('getResponse', () => {
    it('copies the response into the answers field for every field with a non-UUID as ref', () => {
      const resp = response.getResponse({
        typeformResponseToken: '0tu5dow00gadadccm0tu5dbz1sqma4vp',
        typeformEvent: {},
        response: formResponse,
        formID: '3889c213-a1af-4cab-8a2c-c39533b2482d'
      })

      expect(resp.answers).to.deep.equal({mood: 'Still fine.'})
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
