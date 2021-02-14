const express = require('express')
const morgan = require('morgan') // logging
const app = express()
const func = require('./index')
const { env } = require('./config')()

app.use(express.json())
app.use(morgan(['staging', 'production'].includes(env) ? 'combined' : 'dev'))
app.get('/healthz', (_, res) => {
  res.status(200).send('ok')
})
app.options('/certificate-generator', func.handler)
app.post('/certificate-generator', func.handler)

module.exports = app
