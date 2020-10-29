class ApiWrapper {
  /**
   * Creates a new ApiWrapper object
   * @param {String} token The Esios personal token
   * @param {Http} http handler - dependency injection
   * @param {String} indicator The Esios API indicator
   */
  constructor (token = '', request = {}, indicator = 1014) {
    this.baseUrl = 'https://api.esios.ree.es'
    this.token = token
    this.request = request
    this.indicator = indicator
    this.defaultResource = `/indicators/${this.indicator}`
  }

  async get (options) {
    try {
      const headers = { headers: { Authorization: `Token token=${this.token}` } }
      let url = ((options && options.resource) ? this.baseUrl + options.resource : this.baseUrl + this.defaultResource)
      url = (options && options.params && options.params.end_date && options.params.start_date) ? url + `?start_date=${options.params.start_date}&end_date=${options.params.end_date}` : url + ''
      const result = await this.request.get(url, headers)
      return result.body.indicator.values
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = ApiWrapper
