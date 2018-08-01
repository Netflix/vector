import * as formats from './formats'
import { expect } from 'chai'

describe('percentage', () => {
  describe('with integer', () => {
    let data = 3
    it('returns correct percentage', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('300%')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns two decimal place number', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('312%')
    })
  })

  describe('with real number (0 first place)', () => {
    let data = 0.12345
    it('returns two decimal place number', () => {
      let result = formats.percentage(data)
      expect(result).to.equal('12%')
    })
  })
})

describe('number', () => {
  describe('with integer', () => {
    let data = 3
    it('returns two decimal place number', () => {
      let result = formats.number(data)
      expect(result).to.equal('3.00')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns two decimal place number', () => {
      let result = formats.number(data)
      expect(result).to.equal('3.12')
    })
  })
})

describe('integer', () => {
  describe('with integer', () => {
    let data = 3
    it('returns integer', () => {
      let result = formats.integer(data)
      expect(result).to.equal('3')
    })
  })

  describe('with real number', () => {
    let data = 3.12345
    it('returns integer', () => {
      let result = formats.integer(data)
      expect(result).to.equal('3')
    })
  })
})
