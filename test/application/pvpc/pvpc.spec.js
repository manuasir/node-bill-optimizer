
const { assert, expect } = require('chai')
const PVPC = require('../../../src/application/pvpc/pvpc')
const token = process.env.token

describe('DHA tests', () => {
  describe('Class instantiation', () => {
    it('Create object', () => {
      const pvpc = new PVPC()
      assert.equal(pvpc.constructor.name, 'PVPC')
    })
  })
  describe('Fetching data', () => {
    it('Prices in range date', async () => {
      const pvpc = new PVPC(token)
      const start = '2020-09-05'
      const end = '2020-09-06'
      const data = await pvpc.getPriceInRangeDate(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 25)
    })
    it('Prices in reduced range hour', async () => {
      const pvpc = new PVPC(token)
      const start = '2020-09-05T19:00:00'
      const end = '2020-09-05T19:00:00'
      const data = await pvpc.getPriceInRangeDate(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 1)
    })
    it('Prices in reduced range hour with date type', async () => {
      const pvpc = new PVPC(token)
      const start = new Date('2020-09-05')
      const startStr = start.toISOString()
      const end = new Date(start.setHours(start.getHours() + 2))
      const endStr = end.toISOString()
      const data = await pvpc.getPriceInRangeDate(startStr, endStr)
      expect(data).to.be.an('array')
      assert.equal(data.length, 3)
    })
    it('Prices in reduced range hour with past date type', async () => {
      const pvpc = new PVPC(token)
      const start = new Date('2020-09-05')
      const startStr = start.toISOString().split('.')[0]
      const end = new Date(start.setHours(start.getHours() + 2))
      const endStr = end.toISOString().split('.')[0]
      const data = await pvpc.getPriceInRangeDate(startStr, endStr)
      expect(data).to.be.an('array')
      assert.equal(data.length, 3)
    })
    it('Missing arguments in range date', async () => {
      const pvpc = new PVPC(token)
      const date = '2020-09-05'
      try {
        await pvpc.getPriceInRangeDate(date)
        assert.fail('was not supposed to succeed')
      } catch (error) { return Promise.resolve(error) }
    })
  })
})
