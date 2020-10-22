const { Api, Http } = require('../../domain/index')

class Dha {

  async getPriceInRangeDate(start, end) {
    try {
      if (!start || typeof start !== 'string' || !end || typeof end !== 'string') {
        throw new Error('Missing arguments. (start, end) or bad type. Required Date type.')
      }
      const opts = { params: { start_date: start, end_date: end} }
      const http = new Http()
      const api = new Api(process.env.token, http)
      const data = (await api.get(opts)).map((item) => {
        return ['value', 'datetime'].reduce((result, key) => { result[key] = item[key]; return result; }, {})
      })
      console.log('data ',data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

}

module.exports = Dha