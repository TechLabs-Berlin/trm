const fs = require('fs')
const path = require('path')
const { Readable } = require('stream')
const { template } = require('lodash')

const tmpl = template(fs.readFileSync(path.join(__dirname, 'index.html')))

module.exports = ({ location, year, firstName, lastName, trackName, trackDescription, projectName, projectDescription, }) => {
  const resources = {
    'gic.svg': fs.createReadStream(path.join(__dirname, 'gic.svg')),
    'reset.css': fs.createReadStream(path.join(__dirname, 'reset.css')),
    'style.css': fs.createReadStream(path.join(__dirname, 'style.css')),
    'TL_Icon.png': fs.createReadStream(path.join(__dirname, 'TL_Icon.png')),
    'TL_Logo_W.png': fs.createReadStream(path.join(__dirname, 'TL_Logo_W.png')),
  }

  return Object.assign({
    'index.html': Readable.from([tmpl({
      location,
      year,
      firstName,
      lastName,
      trackName,
      trackDescription,
      projectName,
      projectDescription,
    })]),
  }, resources)
}
