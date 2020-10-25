
const { assert, expect } = require('chai')
const Dha = require('../../../src/application/dha/dha')
const token = process.env.token

describe('DHA tests', () => {
  describe('Class instantiation', () => {
    it('Create object', () => {
      const dha = new Dha()
      assert.equal(dha.constructor.name, 'Dha')
    })
  })
  describe('Fetching data', () => {
    it('Prices in range date', async () => {
      const dha = new Dha(token)
      const start = '2020-09-05'
      const end = '2020-09-06'
      const data = await dha.getPriceInRangeDate(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 25)
    })
    it('Prices in reduced range hour', async () => {
      const dha = new Dha(token)
      const start = '2020-09-05T19:00:00'
      const end = '2020-09-05T19:00:00'
      const data = await dha.getPriceInRangeDate(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 1)
    })
    it('Prices in reduced range hour with date type', async () => {
      const dha = new Dha(token)
      const start = new Date('2020-09-05')
      const startStr = start.toISOString()
      const end = new Date(start.setHours(start.getHours() + 2))
      const endStr = end.toISOString()
      console.log('start 00 ',startStr)
      console.log('end 00 + 2',endStr)

      const data = await dha.getPriceInRangeDate(startStr, endStr)
      console.log('data ',data)
      expect(data).to.be.an('array')
      assert.equal(data.length, 3)
    })
    it('Prices in reduced range hour with past date type', async () => {
      const dha = new Dha(token)
      const start = new Date('2020-09-05')
      const startStr = start.toISOString().split('.')[0]
      const end = new Date(start.setHours(start.getHours() + 2))
      const endStr = end.toISOString().split('.')[0]
      const data = await dha.getPriceInRangeDate(startStr, endStr)
      expect(data).to.be.an('array')
      assert.equal(data.length, 3)
    })
    it('Missing arguments in range date', async () => {
      const dha = new Dha(token)
      const date = '2020-09-05'
      try {
        await dha.getPriceInRangeDate(date)
        assert.fail('was not supposed to succeed')
      } catch (error) { return Promise.resolve(error) }
    })
  })
})
