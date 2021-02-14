const FormData = require('form-data')
const { Readable } = require('stream')

module.exports = ({ gotenbergURL, fetch, tokenProvider }) => {
  return async ({ files }) => {
    const token = await tokenProvider()
    var form = new FormData()
    for(const [filename, content] of Object.entries(files)) {
      form.append('files', content, { filename })
    }
    form.append('marginTop', '0.5')
    form.append('marginBottom', '0.5')
    form.append('marginLeft', '0.5')
    form.append('marginRight', '0.5')
    return fetch(`${gotenbergURL}/convert/html`, {
             method: 'POST',
             body: form,
             headers: { 'Authorization': `Bearer ${token}`}
            })
           .then(r => r.ok ? Promise.resolve(r) : Promise.reject(r))
           .then(r => r.blob())
           .then(b => b.stream())
           .catch(r => {
             return r.text().then(body => Promise.reject({
               status: r.status,
               body,
             }))
           })
  }
}
