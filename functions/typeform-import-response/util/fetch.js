const nodeFetch = require('node-fetch')

const fetch = async (log, url, request) => {
  log.debug(`Fetch ${url}`, { request })
  const resp = await nodeFetch(url, request)
  log.debug(`Fetched ${url}`, { status: resp.status })
  return resp
}

module.exports = ({ log }) => fetch.bind(undefined, log)
