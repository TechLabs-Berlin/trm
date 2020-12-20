const express = require('express')
const morgan = require('morgan') // logging
const app = express()
const func = require('./index')

app.use(express.json())
app.use(morgan('dev'));
app.get('/healthz', (_, res) => {
  res.status(200).send('ok')
})
app.options('/auth', func.handler)
app.post('/auth', func.handler)

module.exports = app
