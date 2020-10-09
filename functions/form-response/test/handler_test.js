const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('handler', () => {
  it.skip('should return a username', async () => {
    const res = await request(app)
      .post('/form-response')
    expect(res.statusCode).to.equal(204)
  })
})
