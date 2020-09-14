const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('handler', () => {
  it('should return a username', () => {
    return request(app)
      .post('/typeform-import-response')
      .then((res) => {
        expect(res.statusCode).to.equal(400)
      })
  })
})
