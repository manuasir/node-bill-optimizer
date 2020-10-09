class ApiWrapper {
  /**
   * Creates a new ApiWrapper object
   * @param {String} token The Esios personal token
   * @param {Http} http handler - dependency injection
   */
  constructor (token = '', request = {}) {
    this.baseUrl = 'https://api.esios.ree.es'
    this.token = token
    this.request = request
  }

  async get (options) {
    try {
      const data = {
        headers: { Authorization: `Token token=${this.token}` },
        options
      }
      const url = (options && options.resource) ? this.baseUrl + options.resource : this.baseUrl + `/indicators/1014`
      const result = await this.request.get(url, data)
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = ApiWrapper
