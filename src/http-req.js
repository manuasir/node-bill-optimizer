
const needle = require('needle')

class Http {
  async get (url, opts) {
    try {
      const data = await needle('get', url, opts)
      if (data.statusCode !== 200) {
        throw new Error(data.body)
      }
      return { body: data.body, code: data.statusCode }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = Http
