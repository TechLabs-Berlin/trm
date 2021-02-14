const NodeCache = require('node-cache')

const CACHE_TIMEOUT = 10 * 60 // 10 minutes
const cache = new NodeCache({ checkperiod: 0 })

module.exports = ({ fetch, gotenbergURL }) => {
  return {
    production: () => {
      let token = cache.get('token')
      if(token) {
        return token
      }
      const params = new URLSearchParams({ audience: gotenbergURL })
      return fetch('http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?'+params, {
        headers: {
          'Metadata-Flavor': 'Google'
        }
      }).then(r => r.text())
        .then(token => {
          cache.set('token', token, CACHE_TIMEOUT)
          return token
        })
    },
    test: () => 'stub',
  }
}
