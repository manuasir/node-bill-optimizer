
const { assert, expect } = require('chai')
const Dha = require('../../../src/application/dha/dha')

describe('DHA tests', () => {
  describe('Class instantiation', () => {
    it('Create object', () => {
      const dha = new Dha()
      assert.equal(dha.constructor.name, 'Dha')
    })
  })
  describe('Fetching data', () => {
    it('Prices in range date', async () => {
      const dha = new Dha()
      const start = '2020-09-05'
      const end = '2020-09-06'
      const data = await dha.getPriceInRangeDate(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 25)
    })
    it('Missing arguments in range date', async () => {
      const dha = new Dha()
      const date = '2020-09-05'
      try {
        await dha.getPriceInRangeDate(date)
        assert.fail('was not supposed to succeed')
      } catch (error) { return Promise.resolve(error) }
    })
  })
})
