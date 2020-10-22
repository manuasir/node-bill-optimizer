
const { assert, expect } = require('chai')
const Http = require('../../../src/domain/http-req/http-req')

describe('HTTP module unit tests', () => {
  const urlTest = 'http://ip.jsontest.com'
  describe('Create object', () => {
    it('Loading a corrupt CSV', () => {
      const req = new Http()
      assert.equal(req.constructor.name, 'Http')
    })
  })

  describe('Requests', () => {
    it('GET', async () => {
      const req = new Http()
      const data = await req.get(urlTest)
      expect(data.body).to.have.property('ip')
    })
    it('GET with options', async () => {
      const req = new Http()
      const options = {
        port: 443,
        method: 'GET'
      }
      const data = await req.get(urlTest, options)
      expect(data.body).to.have.property('ip')
      return Promise.resolve()
    })
  })
})
