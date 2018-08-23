import * as utils from './utils'
import { expect } from 'chai'

describe('combineValuesAtTimestampReducer', () => {
  describe('with a sum combiner', () => {
    const sum = (a, b) => (a + b)
    describe('with no timestamps', () => {
      const data = []
      it('produces an empty array', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(0)
      })
    })

    describe('with no matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(4567), value: 3 },
      ]
      it('produces a concat result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 1 },
          { ts: new Date(4567), value: 3 },
        ])
      })
    })

    describe('with two matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
      ]
      it('produces a single output with combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 4 },
        ])
      })
    })

    describe('with four matching timestamps', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
        { ts: new Date(1234), value: 5 },
        { ts: new Date(1234), value: 9 },
      ]
      it('produces a single output with combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 18 },
        ])
      })
    })

    describe('with two timestamps and four values each', () => {
      const data = [
        { ts: new Date(1234), value: 1 },
        { ts: new Date(1234), value: 3 },
        { ts: new Date(1234), value: 5 },
        { ts: new Date(1234), value: 9 },
        { ts: new Date(5678), value: 101 },
        { ts: new Date(5678), value: 103 },
        { ts: new Date(5678), value: 105 },
        { ts: new Date(5678), value: 109 },
      ]
      it('produces two timestamps with correct combined result', () => {
        const result = data.reduce(utils.combineValuesAtTimestampReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { ts: new Date(1234), value: 18 },
          { ts: new Date(5678), value: 418 },
        ])
      })
    })
  })
})

describe('combineValuesByTitleReducer', () => {
  describe('with a sum combiner', () => {
    const sum = (a, b) => (a + b)
    describe('with empty input', () => {
      const data = []
      it('returns an empty array', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(0)
      })
    })
    describe('with no overlap at same time', () => {
      const data = [
        { metric: 'cpu', instance: 'cpu0', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { metric: 'iops', instance: 0, title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
      ]
      it('returns unique titles', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { metric: 'cpu', instance: 'cpu0', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
          { metric: 'iops', instance: 0, title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
        ])
      })
    })

    describe('with no overlap at different time', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
      ]
      it('returns unique titles', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
          { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
        ])
      })
    })

    describe('with overlap at different time', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(5678), value: 7 } ] },
      ]
      it('returns a single timeline', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 7 } ] },
        ])
      })
    })

    describe('with a single title and multiple lines', () => {
      const data = [
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 5 } ] },
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(5678), value: 50 } ] },
      ]
      it('combines to a single title', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 11 }, { ts: new Date(5678), value: 55 } ] },
        ])
      })
    })

    describe('with a mix of titles with multiple lines', () => {
      const data = [
        { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 5 } ] },
        { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(5678), value: 50 } ] },
        { metric: 'iops', title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
        { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 } ] },
        { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(5678), value: 7 } ] },
      ]
      it('combines to the correct mix', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(3)
        expect(result).to.have.deep.members([
          { metric: 'cpu', title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 11 }, { ts: new Date(5678), value: 55 } ] },
          { metric: 'iops', title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
          { metric: 'netbytes', title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 }, { ts: new Date(5678), value: 7 } ] },
        ])
      })
    })
  })
})

describe('getAllMetricInstancesAtTs', () => {
  describe('with a single instance', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0.5 }, { ts: new Date(1235), value: 0.6 }, { ts: new Date(1236), value: 0.5 } ] },
    ]
    it('fetches nothing for missing values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1233))).to.deep.equal([ ])
    })
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1235))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.6 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1236))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
      ])
    })
  })
  describe('with multiple instances', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0.5 }, { ts: new Date(1235), value: 0.6 }, { ts: new Date(1236), value: 0.5 } ] },
      { metric: 'network', instance: 'eth0', data: [ { ts: new Date(1234), value: 100 }, { ts: new Date(1235), value: 105 }, { ts: new Date(1236), value: 110 } ] }
    ]
    it('fetches nothing for missing values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1233))).to.deep.equal([ ])
    })
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
        { metric: 'network', instance: 'eth0', value: 100 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1235))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.6 },
        { metric: 'network', instance: 'eth0', value: 105 },
      ])
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1236))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0.5 },
        { metric: 'network', instance: 'eth0', value: 110 },
      ])
    })
  })
  describe('with a zero value', () => {
    let metricInstances = [
      { metric: 'cpu', instance: 'cpu0', data: [ { ts: new Date(1234), value: 0 } ] }
    ]
    it('extracts the values', () => {
      expect(utils.getAllMetricInstancesAtTs(metricInstances, new Date(1234))).to.deep.equal([
        { metric: 'cpu', instance: 'cpu0', value: 0 },
      ])
    })
  })
})

describe('transposeToTimeslices', () => {
  describe('with multiple instances', () => {
    let data = [
      { metric: 'mem.free', instance: -1, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
    ]
    it('transposes', () => {
      let transposed = utils.transposeToTimeslices(data)
      expect(transposed.length).to.equal(3)
      expect(transposed).to.have.deep.members([
        { ts: new Date(1234), values: { 'mem.free': { '-1': 10 }, 'mem.used': { '-1': 90 } } },
        { ts: new Date(1235), values: { 'mem.free': { '-1': 15 }, 'mem.used': { '-1': 85 } } },
        { ts: new Date(1236), values: { 'mem.free': { '-1': 30 }, 'mem.used': { '-1': 70 } } },
      ])
    })
  })
  describe('with instance tags of 0', () => {
    let data = [
      { metric: 'mem.free', instance: 0, data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
      { metric: 'mem.used', instance: -1, data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
    ]
    it('transposes', () => {
      let transposed = utils.transposeToTimeslices(data)
      expect(transposed.length).to.equal(3)
      expect(transposed).to.have.deep.members([
        { ts: new Date(1234), values: { 'mem.free': { '0': 10 }, 'mem.used': { '-1': 90 } } },
        { ts: new Date(1235), values: { 'mem.free': { '0': 15 }, 'mem.used': { '-1': 85 } } },
        { ts: new Date(1236), values: { 'mem.free': { '0': 30 }, 'mem.used': { '-1': 70 } } },
      ])
    })
  })
})

describe('applyFunctionsToTimeslices', () => {
  let functions = {
    'sum': slice => ({ '-1': slice['mem.free']['0'] + slice['mem.used']['-1'] }),
    'min': slice => ({ '-1': Math.min(slice['mem.free']['0'], slice['mem.used']['-1']) }),
  }
  let timeslices = [
    { ts: new Date(1234), values: { 'mem.free': { '0': 10 }, 'mem.used': { '-1': 90 } } },
    { ts: new Date(1235), values: { 'mem.free': { '0': 15 }, 'mem.used': { '-1': 85 } } },
    { ts: new Date(1236), values: { 'mem.free': { '0': 30 }, 'mem.used': { '-1': 70 } } },
  ]
  it('applies the functions', () => {
    let applied = utils.applyFunctionsToTimeslices(timeslices, functions)
    expect(applied.length).to.equal(3)
    expect(applied).to.have.deep.members([
      { ts: new Date(1234), values: { 'sum': { '-1': 100 }, 'min': { '-1': 10 } } },
      { ts: new Date(1235), values: { 'sum': { '-1': 100 }, 'min': { '-1': 15 } } },
      { ts: new Date(1236), values: { 'sum': { '-1': 100 }, 'min': { '-1': 30 } } },
    ])
  })
})

describe('untransposeTimeslices', () => {
  describe('with multiple instances', () => {
    let data = [
      { ts: new Date(1234), values: { 'mem.free': { '-1': 10 }, 'mem.used': { '-1': 90 } } },
      { ts: new Date(1235), values: { 'mem.free': { '-1': 15 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '-1': 30 }, 'mem.used': { '-1': 70 } } },
    ]
    it('untransposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(2)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '-1', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })

  describe('with instance tags of 0', () => {
    let data = [
      { ts: new Date(1234), values: { 'mem.free': { '0': 10, 'foo': 3 }, 'mem.used': { '-1': 90 } } },
      { ts: new Date(1235), values: { 'mem.free': { '0': 15, 'foo': 4 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '0': 30, 'foo': 5 }, 'mem.used': { '-1': 70 } } },
    ]
    it('transposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(3)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '0', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.free', instance: 'foo', data: [ { ts: new Date(1234), value: 3 }, { ts: new Date(1235), value: 4 }, { ts: new Date(1236), value: 5 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1234), value: 90 }, { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })

  describe('with an empty first timeslice', () => {
    let data = [
      { ts: new Date(1234), values: { } },
      { ts: new Date(1235), values: { 'mem.free': { '0': 15, 'foo': 4 }, 'mem.used': { '-1': 85 } } },
      { ts: new Date(1236), values: { 'mem.free': { '0': 30, 'foo': 5 }, 'mem.used': { '-1': 70 } } },
    ]
    it('transposes', () => {
      let untransposed = utils.untransposeTimeslices(data)
      expect(untransposed.length).to.equal(3)
      expect(untransposed).to.have.deep.members([
        { metric: 'mem.free', instance: '0', data: [ { ts: new Date(1235), value: 15 }, { ts: new Date(1236), value: 30 } ] },
        { metric: 'mem.free', instance: 'foo', data: [ { ts: new Date(1235), value: 4 }, { ts: new Date(1236), value: 5 } ] },
        { metric: 'mem.used', instance: '-1', data: [ { ts: new Date(1235), value: 85 }, { ts: new Date(1236), value: 70 } ] }
      ])
    })
  })
})
