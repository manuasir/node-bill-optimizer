
const { assert, expect } = require('chai')
const Http = require('../../../src/domain/http-req/http-req')
const Api = require('../../../src/domain/redata-api/redata-api')

describe('API Wrapper tests', () => {
  describe('Class instantiation', () => {
    it('Create object', () => {
      const req = new Http()
      const api = new Api(process.env.token, req)
      assert.equal(api.constructor.name, 'ApiWrapper')
    })
  })
  describe('API requests', () => {
    it('Empty GET request', async () => {
      const req = new Http()
      const api = new Api(process.env.token, req)
      const data = await api.get()
      expect(data).to.be.an('array')
    })
  })
})
