
class ApiWrapper {
  /**
   * Creates a new ApiWrapper object
   * @param {String} token The Esios personal token
   */
  constructor (token) {
    this.baseUrl = 'https://api.esios.ree.es/indicators/1014'
    this.token = token
  }
}

module.exports = ApiWrapper
