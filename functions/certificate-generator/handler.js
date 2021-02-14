const asyncPool = require('tiny-async-pool')
const archiver = require('archiver')
const promiseRetry = require('promise-retry')
const templateGenerator = require('./template/generator')

// number of certificates to fetch simultaneously
// Gotenberg allows 6 parallel conversions so we account for data fetching overhead and choose 7
// https://thecodingmachine.github.io/gotenberg/#scalability
const parallelism = 7

module.exports = ({ buildTRMAPI, jwt, log, pdfGenerator }) => {
  return async ({ req, res }) => {
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST')
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.set('Access-Control-Max-Age', '3600')
      res.set('Access-Control-Allow-Origin', '*')
      res.status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).send('method not allowed')
      return
    }

    if(!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) {
        res.status(401).send('unauthorized')
        return
    }

    const token = req.headers.authorization.slice(7) // remove 'Bearer '
    let payload;
    try {
      payload = jwt.verify(token)
    } catch(err) {
      log.error(`Error verifying JWT: ${err}`)
      res.status(401).send('unauthenticated')
      return
    }

    const { location } = payload
    if(!location) {
      log.error('Did not find location claim in JWT payload')
      res.status(401).send('unauthenticated')
      return
    }

    let semesterID
    if('semesterID' in req.body) {
      semesterID = req.body.semesterID
    } else {
      res.status(400).send('no semesterID')
      return
    }

    const trmAPI = await buildTRMAPI
    const semester = await trmAPI.getSemesterByID({ semesterID })

    if(semester.location !== location) {
      log.error(`Requester location is ${location} but semester location is ${semester.location}, unauthorized`)
      res.status(403).send('unauthorized')
      return
    }

    return new Promise(async (resolve, reject) => {
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="certificates.zip"',
        'Access-Control-Allow-Origin': '*',
      })
      const zip = archiver('zip', { zlib: { level: 9 } })
      zip.on('error', e => { reject(e) })
      zip.on('warning', err => log.error(err))
      zip.on('end', () => resolve())
      zip.pipe(res)

      await asyncPool(parallelism, semester.techies, async (techieFromSemester) => {
        if(techieFromSemester.state !== 'ALUMNI') {
          log.debug(`Techie ${techieFromSemester.id} is not an ALUMNI, ignoring`, { techieFromSemester })
          return
        }
        const { found, techie } = await trmAPI.findTechieByID({ id: techieFromSemester.id })
        if(!found) {
          log.warning(`Expected to find techie ${techieFromSemester.id} but didn't, ignoring`, { techieFromSemester })
          return
        }
        log.info(`Generating certificate for techie ${techie.id}`)
        const files = templateGenerator({
          location: trmAPI.locations.byID(techie.location).name,
          year: trmAPI.terms.byID(techie.semester.term).year.toString(),
          firstName: techie.first_name,
          lastName: techie.last_name,
          trackName: techie.track ? trmAPI.tracks.byID(techie.track).name : '',
          trackDescription: techie.track ? trmAPI.tracks.byID(techie.track).description : '',
          projectName: techie.project ? techie.project.name : '',
          projectDescription: techie.project ? techie.project.description : '',
        })
        const certificate = await promiseRetry(retry => {
          return pdfGenerator({ files })
            .catch(err => {
              // retry for status code 5xx
              if(err.status >= 500 && err.status < 600) {
                log.warning(`PDF generator failed with code ${err.code}, retrying`, { err })
                retry(err)
              }
              log.error(`PDF generator failed with code ${err.code}, aborting`, { err })
              throw err
            })
        })
        zip.append(certificate, { name: `${techie.first_name} ${techie.last_name}.pdf`})
      })

      zip.finalize()
    })
  }
}
