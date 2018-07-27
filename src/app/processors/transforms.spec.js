import * as transforms from './transforms'
import { expect } from 'chai'

describe('filterOutPartialTimestamps', () => {
  describe('with a single metric', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
    ]
    it('returns all metrics', () => {
      let filtered = transforms.filterOutPartialTimestamps(data)
      expect(filtered.length).to.equal(1)
      expect(filtered).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      ])
    })
  })

  describe('with three complete metrics', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 5 }, { ts: new Date(1236), value: 7 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 }, { ts: new Date(1235), value: 6 }, { ts: new Date(1236), value: 8 } ] },
    ]
    it('returns all metrics', () => {
      let filtered = transforms.filterOutPartialTimestamps(data)
      expect(filtered.length).to.equal(3)
      expect(filtered).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 5 }, { ts: new Date(1236), value: 7 } ] },
        { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 }, { ts: new Date(1235), value: 6 }, { ts: new Date(1236), value: 8 } ] },
      ])
    })
  })

  describe('with no overlapped metrics', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1235), value: 5 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1236), value: 8 } ] },
    ]
    it('returns an empty set', () => {
      let filtered = transforms.filterOutPartialTimestamps(data)
      expect(filtered.length).to.equal(3)
      expect(filtered).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ ] },
        { metric: 'mem.used', instance: -1, data: [ ] },
        { metric: 'mem.used', instance: 99, data: [ ] },
      ])
    })
  })

  describe('with one overlap', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 }, { ts: new Date(1235), value: 6 }, { ts: new Date(1236), value: 8 } ] },
    ]
    it('returns the overlapping set', () => {
      let filtered = transforms.filterOutPartialTimestamps(data)
      expect(filtered.length).to.equal(3)
      expect(filtered).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 } ] },
        { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 } ] },
        { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 } ] },
      ])
    })
  })
})
