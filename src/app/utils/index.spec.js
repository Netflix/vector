import * as utils from './'
import url from 'url'
import { expect } from 'chai'

describe('getChartsFromLocation', () => {
  describe('with new style search string', () => {
    const search = '?q=[{"h":"192.168.251.133:44323","hs":"localhost","ci":"_all","cl":["cpu-pswitch"]},{"h":"1.2.3.4:7402","hs":"localhost","ci":"_all","cl":[]},{"h":"192.168.251.133:44323","hs":"localhost","ci":"hopeful_dijkstra","cl":["container-percont-cpu","container-percont-mem","container-total-cont-mem"]}]'
    const result = utils.getChartsFromLocation({ search, hash: null })
    it('finds three targets', () => {
      expect(result.targets.length).to.equal(3)
      expect(result.targets).to.have.deep.members([
        { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: '_all' },
        { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' },
        { hostname: '1.2.3.4:7402', hostspec: 'localhost', containerId: '_all' },
      ])
    })

    it('finds four charts in the chartlist', () => {
      expect(result.chartlist.length).to.equal(4)
      expect(result.chartlist).to.have.deep.members([
        { target: { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: '_all' }, chartId: 'cpu-pswitch' },
        { target: { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-percont-cpu' },
        { target: { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-percont-mem' },
        { target: { hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-total-cont-mem' },
      ])
    })
  })

  describe('with old style hash string', () => {
    describe('with a container', () => {
      const hash = '#/?host=100.65.15.127&container=09fb4cae-8987-49bc-a208-1115aa0443e1'
      const result = utils.getChartsFromLocation({ search: null, hash })
      it('finds a single target with a container', () => {
        expect(result.targets.length).to.equal(1)
        expect(result.targets).to.have.deep.members([
          { hostname: '100.65.15.127:7402', hostspec: 'localhost', containerId: '09fb4cae-8987-49bc-a208-1115aa0443e1' }
        ])
      })
      it('finds a single chart attached to that container', () => {
        expect(result.chartlist.length).to.equal(0)
      })
    })

    describe('without a container', () => {
      const hash = '#/?host=100.82.47.121'
      const result = utils.getChartsFromLocation({ search: null, hash })
      it('finds a single target connected to _all container', () => {
        expect(result.targets.length).to.equal(1)
        expect(result.targets).to.have.deep.members([
          { hostname: '100.82.47.121:7402', hostspec: 'localhost', containerId: '_all' }
        ])
      })
      it('does not find any charts', () => {
        expect(result.chartlist.length).to.equal(0)
      })
    })
  })

  describe('with empty string', () => {
    const result = utils.getChartsFromLocation({ search: null, hash: null })
    it('finds no targets', () => {
      expect(result.targets.length).to.equal(0)
    })
    it('finds no charts', () => {
      expect(result.chartlist.length).to.equal(0)
    })
  })
})

