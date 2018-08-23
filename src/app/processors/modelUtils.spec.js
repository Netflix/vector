import * as utils from './modelUtils'
import { expect } from 'chai'

describe('transformRawDataToPipelineData', () => {
  describe('with a full dataset', () => {
    let rawdatasets
    beforeEach(() => {
      rawdatasets = require('../../../test/rawdata.json')
    })

    describe('for kernel.all.load', () => {
      it('returns the correct data', () => {
        let pipelineData = utils.transformRawDataToPipelineData(rawdatasets, { metricNames: ['kernel.all.load'] })
        expect(pipelineData.length).to.equal(3)
        expect(pipelineData).to.have.deep.members([
          { "metric": "kernel.all.load", "instance": 1,
            "data": [
              { "ts": new Date("2018-08-22T22:23:35.285Z"), "value": 0.1 },
              { "ts": new Date("2018-08-22T22:23:37.275Z"), "value": 0.1 },
              { "ts": new Date("2018-08-22T22:23:39.278Z"), "value": 0.090000004 },
              { "ts": new Date("2018-08-22T22:23:41.284Z"), "value": 0.090000004 },
              { "ts": new Date("2018-08-22T22:23:43.275Z"), "value": 0.090000004 }
            ] },
          { "metric": "kernel.all.load", "instance": 5,
            "data": [
              { "ts": new Date("2018-08-22T22:23:35.285Z"), "value": 0.039999999 },
              { "ts": new Date("2018-08-22T22:23:37.275Z"), "value": 0.039999999 },
              { "ts": new Date("2018-08-22T22:23:39.278Z"), "value": 0.039999999 },
              { "ts": new Date("2018-08-22T22:23:41.284Z"), "value": 0.039999999 },
              { "ts": new Date("2018-08-22T22:23:43.275Z"), "value": 0.039999999 }
            ] },
          { "metric": "kernel.all.load", "instance": 15,
            "data": [
              { "ts": new Date("2018-08-22T22:23:35.285Z"), "value": 0.0099999998 },
              { "ts": new Date("2018-08-22T22:23:37.275Z"), "value": 0.0099999998 },
              { "ts": new Date("2018-08-22T22:23:39.278Z"), "value": 0 },
              { "ts": new Date("2018-08-22T22:23:41.284Z"), "value": 0 },
              { "ts": new Date("2018-08-22T22:23:43.275Z"), "value": 0 }
            ]
          }
        ])
      })
    })

    describe('for bcc.runq.latency', () => {
      it('returns the correct data', () => {
        let pipelineData = utils.transformRawDataToPipelineData(rawdatasets, { metricNames: ['bcc.runq.latency'] })
        expect(pipelineData.length).to.equal(18)
        expect(pipelineData).to.have.deep.members([
          { "metric": "bcc.runq.latency", "instance": 0,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 5583 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 5583 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 5583 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 5583 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 5583 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 1,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 130837 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 130838 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 130840 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 130840 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 130842 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 2,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 256041 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 256049 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 256061 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 256063 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 256079 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 3,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 107807 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 107833 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 107855 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 107858 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 107885 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 4,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 110856 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 110898 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 110937 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 110974 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 110997 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 5,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 60577 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 60583 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 60595 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 60615 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 60642 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 6,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 294239 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 294242 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 294249 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 294255 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 294266 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 7,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 29600 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 29602 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 29606 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 29611 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 29616 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 8,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 6820 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 6822 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 6827 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 6827 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 6829 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 9,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 3919 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 3922 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 3923 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 3923 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 3925 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 10,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 2453 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 2454 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 2454 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 2457 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 2459 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 11,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 3321 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 3322 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 3323 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 3324 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 3328 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 12,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 2064 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 2064 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 2064 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 2065 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 2066 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 13,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 588 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 588 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 588 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 588 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 588 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 14,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 209 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 209 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 209 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 209 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 209 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 15,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 57 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 57 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 57 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 57 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 57 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 16,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 19 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 19 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 19 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 19 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 19 }
            ] },
          { "metric": "bcc.runq.latency", "instance": 17,
            "data": [
              { "ts": new Date("2018-08-22T22:23:51.279Z"), "value": 2 },
              { "ts": new Date("2018-08-22T22:23:53.277Z"), "value": 2 },
              { "ts": new Date("2018-08-22T22:23:55.294Z"), "value": 2 },
              { "ts": new Date("2018-08-22T22:23:57.278Z"), "value": 2 },
              { "ts": new Date("2018-08-22T22:23:59.277Z"), "value": 2 }
            ] }
        ])
      })
    })

    describe('for kernel.all.cpu.sys and hinv.ncpu', () => {
      it('returns the correct data', () => {
        let pipelineData = utils.transformRawDataToPipelineData(rawdatasets, { metricNames: ['kernel.all.cpu.sys', 'hinv.ncpu'] })
        expect(pipelineData.length).to.equal(2)
        expect(pipelineData).to.have.deep.members([
          { "metric": "kernel.all.cpu.sys", "instance": -1,
            "data": [
              { "ts": new Date("2018-08-22T22:24:03.287Z"), "value": 365600 },
              { "ts": new Date("2018-08-22T22:24:05.275Z"), "value": 365620 },
              { "ts": new Date("2018-08-22T22:24:07.276Z"), "value": 365630 },
              { "ts": new Date("2018-08-22T22:24:09.276Z"), "value": 365640 }
            ] },
          { "metric": "hinv.ncpu", "instance": -1,
            "data": [
              { "ts": new Date("2018-08-22T22:24:03.287Z"), "value": 1 },
              { "ts": new Date("2018-08-22T22:24:05.275Z"), "value": 1 },
              { "ts": new Date("2018-08-22T22:24:07.276Z"), "value": 1 },
              { "ts": new Date("2018-08-22T22:24:09.276Z"), "value": 1 }
            ] }
        ])
      })
    })

    describe('for invalid metric', () => {
      it.skip('returns null', () => {
        let pipelineData = utils.transformRawDataToPipelineData(rawdatasets, { metricNames: ['zzzz'] })
        expect(pipelineData).to.equal(null)
      })
    })
  })
})
