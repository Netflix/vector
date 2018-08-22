import * as transforms from './transforms'
import { expect } from 'chai'

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

describe('filterKeepSelectedMetrics', () => {
  let data = [
      { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
  ]

  describe('with empty selected metrics', () => {
    it('returns no values', () => {
      let chartInfo = { selectedMetrics: [ ] }
      let filtered = transforms.filterKeepSelectedMetrics('selectedMetrics')(data, { chartInfo })
      expect(filtered.length).to.equal(0)
    })
  })

  describe('with all metrics', () => {
    it('returns all values', () => {
      let chartInfo = { selectedMetrics: [ 'containercpu', 'containerram' ] }
      let filtered = transforms.filterKeepSelectedMetrics('selectedMetrics')(data, { chartInfo })
      expect(filtered.length).to.equal(4)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
        { metric: 'containerram', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containerram', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })

  describe('with one selected metrics', () => {
    it('returns selected values', () => {
      let chartInfo = { selectedMetrics: [ 'containercpu' ] }
      let filtered = transforms.filterKeepSelectedMetrics('selectedMetrics')(data, { chartInfo })
      expect(filtered.length).to.equal(2)
      expect(filtered).to.have.deep.members([
        { metric: 'containercpu', instance: 'abc', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'containercpu', instance: 'def', data: [ { ts: new Date(1234), value: 3 } ] },
      ])
    })
  })
})

describe('onlyLatestValues', () => {
  describe('with all equivalent values', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 5 }, { ts: new Date(1236), value: 7 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 }, { ts: new Date(1235), value: 6 }, { ts: new Date(1236), value: 8 } ] },
    ]
    it('returns only latest', () => {
      let latest = transforms.onlyLatestValues()(data)
      expect(latest.length).to.equal(3)
      expect(latest).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1236), value: 7 } ] },
        { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1236), value: 8 } ] },
      ])
    })
  })

  describe('with mixed values', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 5 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 } ] },
    ]
    it('returns latest for each', () => {
      let latest = transforms.onlyLatestValues()(data)
      expect(latest.length).to.equal(3)
      expect(latest).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1235), value: 5 } ] },
        { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 } ] },
      ])
    })
  })

  describe('with one value', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 } ] },
      { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 } ] },
    ]
    it('returns input', () => {
      let latest = transforms.onlyLatestValues()(data)
      expect(latest.length).to.equal(3)
      expect(latest).to.have.deep.members([
        { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 } ] },
        { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 3 } ] },
        { metric: 'mem.used', instance: 99, data: [ { ts: new Date(1234), value: 4 } ] },
      ])
    })
  })
})
