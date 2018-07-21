import * as utils from './utils'
import { expect } from 'chai'

describe('createTimestampFromDataset', () => {
  it('creates the correct timestamp', () => {
    const dataset = {
      timestamp: {
        s: 1531869878,
        us: 882804,
      }
    }
    let result = utils.createTimestampFromDataset(dataset)
    expect(result.toISOString()).to.equal('2018-07-17T23:24:38.882Z')
  })
})

describe('extractInstancesForMetric', () => {
  let datasets
  describe('with full datasets', () => {
    beforeEach(() => {
      datasets = require('../../../test/datasets.json')
    })

    describe('looking for a single instance item (pswitch)', () => {
      it('finds { pswitch, -1 }', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch' ])
        expect(result.length).to.equal(1)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.pswitch', instance: -1 },
          ])
      })
    })

    describe('looking for multiple instances (pswitch, runnable)', () => {
      it('finds [{ pswitch, -1 }, { runnable, -1 }]', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch', 'kernel.all.runnable' ])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.runnable', instance: -1 },
            { metric: 'kernel.all.pswitch', instance: -1 },
          ])
      })
    })

    describe('looking for a multiple instance item (load avg)', () => {
      it('finds [{ load, 1 }, { load, 5 }, { load, 15 }]', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.load' ])
        expect(result.length).to.equal(3)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.load', instance: 1 },
            { metric: 'kernel.all.load', instance: 5 },
            { metric: 'kernel.all.load', instance: 15 },
          ])
      })
    })

    describe('looking for a mix', () => {
      it('finds all', () => {
        let result = utils.extractInstancesForMetric(datasets, [ 'kernel.all.pswitch', 'kernel.all.runnable', 'kernel.all.load' ])
        expect(result.length).to.equal(5)
        expect(result).to.have.deep.members([
            { metric: 'kernel.all.runnable', instance: -1 },
            { metric: 'kernel.all.pswitch', instance: -1 },
            { metric: 'kernel.all.load', instance: 1 },
            { metric: 'kernel.all.load', instance: 5 },
            { metric: 'kernel.all.load', instance: 15 },
          ])
      })
    })
  })
})

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
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
        { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
      ]
      it('returns unique titles', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(2)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 } ] },
          { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(1234), value: 1 } ] },
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
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 1 }, { ts: new Date(5678), value: 5 } ] },
        { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 10 }, { ts: new Date(5678), value: 50 } ] },
        { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
        { title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 } ] },
        { title: 'network', keylabel: 'network', data: [ { ts: new Date(5678), value: 7 } ] },
      ]
      it('combines to the correct mix', () => {
        const result = data.reduce(utils.combineValuesByTitleReducer(sum), [])
        expect(result.length).to.equal(3)
        expect(result).to.have.deep.members([
          { title: 'cpu', keylabel: 'cpu', data: [ { ts: new Date(1234), value: 11 }, { ts: new Date(5678), value: 55 } ] },
          { title: 'disk', keylabel: 'disk', data: [ { ts: new Date(5678), value: 1 } ] },
          { title: 'network', keylabel: 'network', data: [ { ts: new Date(1234), value: 5 }, { ts: new Date(5678), value: 7 } ] },
        ])
      })
    })
  })
})

