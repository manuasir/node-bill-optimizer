const { Api, Http } = require('../../domain/index')

class PVPC {
  constructor(token){
    this.token = token
  }
  async getPriceInRangeDate (start, end, indicator = 1014) {
    try {
      if (!start || !end ) {
        throw new Error('Missing arguments. (start, end) or bad type. Required Date type.')
      }
      const opts = { params: { start_date: start, end_date: end } }
      const http = new Http()
      const api = new Api(this.token, http, indicator)
      const data = (await api.get(opts)).map((item) => {
        return ['value', 'datetime'].reduce((result, key) => { result[key] = item[key]; return result }, {})
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = PVPC
