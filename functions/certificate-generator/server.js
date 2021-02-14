const app = require('./app')
const { port } = require('./config')()

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

process.on('SIGTERM', () => {
  console.info('SIGTERM received, closing HTTP server')
  server.close(() => {
    console.info('HTTP server closed')
  })
})
