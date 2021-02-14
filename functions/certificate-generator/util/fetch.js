const nodeFetch = require('node-fetch')
const http = require('http')
const https = require('https')

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

const defaults = {
  httpAgent,
  httpsAgent,
}

const fetch = async (log, url, request) => {
  log.debug(`Fetch ${url}`, { request })
  const resp = await nodeFetch(url, { ...defaults, ...request })
  log.debug(`Fetched ${url}`, { status: resp.status })
  return resp
}

module.exports = ({ log }) => fetch.bind(undefined, log)
