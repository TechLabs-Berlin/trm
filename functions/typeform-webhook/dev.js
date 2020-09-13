const express = require('express')
const morgan = require('morgan') // logging
const app = express()
const func = require('./index')
const port = 8000

app.use(express.json())
app.use(morgan('dev'));
app.post('/typeform-webhook', func.handler)
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
