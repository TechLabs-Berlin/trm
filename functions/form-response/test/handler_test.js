const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('handler', () => {
  it.skip('should return a username', () => {
    return request(app)
      .post('/form-response')
      .then((res) => {
        expect(res.statusCode).to.equal(204)
      })
  })
})
