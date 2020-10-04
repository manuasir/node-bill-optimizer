const csv = require('csv-parser')
const fs = require('fs')

class CsvReader {
  /**
   * The path of the CSV file
   * @param {String} path
   */
  constructor (path = '') {
    this.path = path
  }

  /**
   * Reads CSV and loads content into data array
   * @returns {Promise} The buffered CSV data in JSON format
   */
  async load () {
    return new Promise((resolve, reject) => {
      const results = []
      try {
        const fileStream = fs.createReadStream(this.path)
        fileStream
          .on('error', (err) => { return reject(err) })
        fileStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => { resolve(results) })
      } catch (error) {
        return reject(error.message || 'Cannot load data.')
      }
    })
  }

  /**
   * Sets the CSV path
   * @param {String} path
   */
  setPath (path) {
    this.path = path
  }

  /**
   * Gets the current CSV path
   * @returns {String} Returns the current path
   */
  getPath () {
    return this.path
  }
}

module.exports = CsvReader
