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

describe('filterForContainerId', () => {
  let data = [
      { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
  ]
  describe('with a different metric id', () => {
    it('returns all values', () => {
      let filtered = transforms.filterForContainerId([ 'containerdisk' ])(data, { containerId: 'abc' })
      expect(filtered.length).to.equal(4)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })
  describe('with a matching metric id and invalid container id', () => {
    it('returns only other metric values', () => {
      let filtered = transforms.filterForContainerId([ 'containercpu' ])(data, { containerId: 'zzz' })
      expect(filtered.length).to.equal(2)
      expect(filtered).to.have.deep.members([
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })
  describe('with a matching metric id', () => {
    it('returns all values', () => {
      let filtered = transforms.filterForContainerId([ 'containercpu' ])(data, { containerId: 'abc' })
      expect(filtered.length).to.equal(3)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })
  describe('with a list including all metrics and empty filter', () => {
    it('returns all values', () => {
      let filtered = transforms.filterForContainerId([ 'containerdisk', 'containercpu', 'containerram' ])(data, { containerId: '' })
      expect(filtered.length).to.equal(4)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })
  describe('with a list including all metrics', () => {
    it('returns filtered values', () => {
      let filtered = transforms.filterForContainerId([ 'containerdisk', 'containercpu', 'containerram' ])(data, { containerId: 'abc' })
      expect(filtered.length).to.equal(2)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      ])
    })
  })
})

describe('copyDataToCoordinatesForSemiotic', () => {
  let data = [
    { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
    { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
  ]
  it('copies values', () => {
    let copied = transforms.copyDataToCoordinatesForSemiotic(data)
    expect(copied.length).to.equal(2)
    expect(copied).to.have.deep.members([
      { metric: 'containerram', instance: 'abc',
        data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ],
        coordinates: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'containerram', instance: 'def',
        data: [ { ts: new Date(1234), value: 3 } ],
        coordinates: [ { ts: new Date(1234), value: 3 } ] },
    ])
  })
})
