
const { assert, expect } = require('chai')
const CsvReader = require('../../src/csv-reader')
const resolve = require('path').resolve

describe('CSV reader unit tests', () => {
  const fields = ['Date', 'Hour', 'Consumption']
  const dataPath = './data/data.csv'

  describe('Instance', () => {
    it('CSVReader object', () => {
      const reader = new CsvReader(dataPath)
      assert.equal(reader.constructor.name, 'CsvReader')
    })
  })
  describe('Getters and setters', () => {
    it('Get empty path', () => {
      const reader = new CsvReader()
      assert.equal(reader.getPath(), '')
    })
    it('Get path', () => {
      const reader = new CsvReader(dataPath)
      assert.equal(reader.getPath(), dataPath)
    })
    it('Set path', () => {
      const reader = new CsvReader(dataPath)
      reader.setPath('newPath')
      assert.equal(reader.getPath(), 'newPath')
    })
  })
  describe('Load CSV data', () => {
    describe('Validate basic behavior', async () => {
      let data
      before(async () => {
        const reader = new CsvReader(resolve('./test/data/data.csv'))
        data = await reader.load()
      })

      it('Load CSV file', async () => {
        try {
          expect(data).to.be.a('array')
          return assert.equal(data.length, 1151)
        } catch (error) {
          return assert.fail(error)
        }
      })
      it('Checking file attributes', async () => {
        return expect(data).to.be.a('array')
      })
      it('Checking CSV fields', async () => {
        const columns = Object.keys(data[0])
        return assert.equal(fields.map((field) => columns.includes(field)).reduce((a, b) => a & b), true)
      })
    })
    describe('Wrong inputs', () => {
      const wrongPath = './csv-reader/data/data.csv'
      const corruptCsvPath = './test/data/corrupt-data.csv'
      it('Loading a wrong path', async () => {
        try {
          const reader = new CsvReader(resolve(wrongPath))
          await reader.load()
          return assert.fail('Should not enter here.')
        } catch (error) {
          return expect(error).to.be.a('error')
        }
      })
      it('Loading a corrupt CSV', async () => {
        try {
          const reader = new CsvReader(resolve(corruptCsvPath))
          const data = await reader.load()
          const columns = Object.keys(data[0])
          return assert.equal(fields.map((field) => columns.includes(field)).reduce((a, b) => a & b), false)
        } catch (error) {
          return assert.fail(error)
        }
      })
    })
  })
})
