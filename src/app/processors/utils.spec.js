import * as utils from './utils'
import { expect } from 'chai'
const datasets = require('../../../test/datasets.json')

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
