
const needle = require('needle')

class Http {
  async get (url, opts) {
    try {
      const data = await needle('get', url, opts)
      return data.body
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = Http
