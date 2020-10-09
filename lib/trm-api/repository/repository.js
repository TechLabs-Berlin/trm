const fs = require('fs')
const path = require('path')

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
      const entry = path.join(dir, d.name);
      if(d.isFile()) {
        const filename = path.basename(entry)
        if(!filename.endsWith('.graphql')) continue
        const name = filename.slice(0, filename.length - '.graphql'.length)
        yield {
          name: name,
          filepath: entry
        }
      }
  }
}

module.exports = async () => {
  const queries = {}
  for await (const { name, filepath } of walk(path.join(__dirname, 'queries'))) {
    queries[name] = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' })
  }

  const mutations = {}
  for await (const { name, filepath } of walk(path.join(__dirname, 'mutations'))) {
    mutations[name] = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' })
  }

  return {
    queries: {
      fetch: name => {
        const query = queries[name]
        if(!query) {
          throw new Error(`query ${name} not found`)
        }
        return query
      },
      all: () => Object.keys(queries)
    },
    mutations: {
      fetch: name => {
        const mutation = mutations[name]
        if(!mutation) {
          throw new Error(`mutation ${name} not found`)
        }
        return mutation
      },
      all: () => Object.keys(mutations)
    }
  }
}
