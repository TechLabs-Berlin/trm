const jwt = require('jsonwebtoken')
const faker = require('faker')

exports.buildHandler = ({ config, log }) => {
  const authorization = require('../store/authorization')({ log })

  return async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST')
      res.set('Access-Control-Allow-Headers', 'Content-Type')
      res.set('Access-Control-Max-Age', '3600')
      res.status(204).send('')
      return
    }
    if (req.method !== 'POST') {
      res.status(405).send('method not allowed')
      return
    }

    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const attributes = {
      email: faker.internet.email(firstName, lastName),
      avatar: faker.image.avatar(),
      groupEmails: ['team_berlin@techlabs.org'] ,
      firstName,
      lastName,
    }

    const token = jwt.sign(
      authorization.getPayload(attributes),
      config.jwtKey,
      {
        algorithm: 'HS256',
        expiresIn: '3 days'
      }
    )

    res.status(200).send(JSON.stringify({token}))
    return
  }
}
