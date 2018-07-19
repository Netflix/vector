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

