const fs = require('fs')
const path = require('path')
const { parse, buildSchema } = require('graphql')
var { validate } = require('graphql/validation')
const { expect } = require('chai')

const buildRepo = require('../../../store/hasura/repository')

describe('hasura repository', async () => {
  const schema = buildSchema(fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'database', 'schema.graphql'), { encoding: 'utf8', flag: 'r' }))
  const { queries, mutations } = await buildRepo()

  describe('queries', () => {
    for(const name of queries.all()) {
      describe(name, () => {
        it('is valid', () => {
          const query = queries.fetch(name)
          const parsedQuery = parse(query)
          const errors = validate(schema, parsedQuery)
          try {
            expect(errors).to.be.empty
          } catch(err) {
            console.log(errors)
            throw err
          }
        })
      })
    }
  })

  describe('mutations', () => {
    for(const name of mutations.all()) {
      describe(name, () => {
        it('is valid', () => {
          const query = mutations.fetch(name)
          const parsedQuery = parse(query)
          const errors = validate(schema, parsedQuery)
          try {
            expect(errors).to.be.empty
          } catch(err) {
            console.log(errors)
            throw err
          }
        })
      })
    }
  })
})
