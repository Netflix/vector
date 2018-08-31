import { expect } from 'chai'
import MultiTable from './MultiTable.jsx'

describe('createTableRows', () => {
  describe('with a missing dataset', () => {
    let dataset = null
    let result = MultiTable.createTableRows(dataset)
    it('returns an empty array', () => {
      expect(Array.isArray(result)).to.equal(true)
      expect(result.length).to.equal(0)
    })
  })

  describe('with a single element', () => {
    expect(true).to.equal(false)
  })

  describe('with multiple elements', () => {
    expect(true).to.equal(false)
  })
})
