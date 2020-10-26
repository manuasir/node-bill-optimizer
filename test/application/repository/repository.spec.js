
const { assert, expect } = require('chai')
const PVPC = require('../../../src/application/pvpc/pvpc')
const Repository = require('../../../src/application/repository/repository')
const token = process.env.token

describe('DHA tests', () => {
  describe('Class instantiation', () => {
    it('Create object', () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      assert.equal(repo.constructor.name, 'DataRepository')
    })
  })
  describe('Class aux methods', () => {
    it('Check hours diff', () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2020-09-05T01:00:00'
      const end = '2020-09-05T03:00:00'
      const result = repo.checkHoursDiff(start, end)
      assert.equal(result, 3)
    })
  })
  describe('Fetching data', () => {
    it('Non cached data', async () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2020-09-05T01:00:00'
      const end = '2020-09-05T03:00:00'
      const data = await repo.get(start, end)
      expect(data).to.be.an('array')
      assert.equal(data.length, 3)
    })
    it('Measure cache size', async () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2020-09-05T01:00:00'
      const end = '2020-09-05T03:00:00'
      const data = await repo.get(start, end)
      expect(data).to.be.an('array')
      assert.equal(repo.getCache().length, 3)
    })
    it('Provoke error from future date', async () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2021-09-05T01:00:00'
      const end = '2021-09-05T03:00:00'
      try {
        await repo.get(start, end)
        return assert.fail('Should not enter here.')
      } catch (error) {
        return expect(error).to.be.a('error')
      }
    })
    it('Provoke time range error', async () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2020-09-05T01:00:00'
      const end = '2020-09-07T03:00:00'
      try {
        await repo.get(start, end)
        return assert.fail('Should not enter here.')
      } catch (error) {
        return expect(error).to.be.a('error')
      }
    })
    describe('Cache tests', () => {
      const pvpc = new PVPC(token)
      const repo = new Repository(pvpc)
      const start = '2020-09-05T01:00:00'
      const end = '2020-09-05T03:00:00'
      it('Current cache size should be 0', () => {
        assert.equal(repo.getCache().length, 0)
      })
      it('Getting non cached data', async () => {
        const data = await repo.get(start, end)
        const reduced = Object.values(data).reduce((t, { consulted }) => t + consulted, 0)
        assert.equal(reduced, 3)
      })
      it('Getting data from cache. Checking consultation incrementation', async () => {
        const data = await repo.get(start, end)
        const reduced = Object.values(data).reduce((t, { consulted }) => t + consulted, 0)
        assert.equal(reduced, 6)
      })
      it('Getting incomplete cached data', async () => {
        const start = '2020-09-05T01:00:00'
        const end = '2020-09-05T05:00:00'
        const data = await repo.get(start, end)
        const reduced = Object.values(data).reduce((t, { consulted }) => t + consulted, 0)
        assert.equal(reduced, 11)
      })
    })
  })
})
