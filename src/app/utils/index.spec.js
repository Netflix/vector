import * as utils from './'
import { expect } from 'chai'

describe('getChartsFromQueryString', () => {
  describe('with full length string', () => {
    const string = '?charts=[{"hostname":"192.168.251.133:44323","hostspec":"localhost","containerId":"_all","chartIds":["cpu-pswitch"]},{"hostname":"1.2.3.4:7402","hostspec":"localhost","containerId":"_all","chartIds":[]},{"hostname":"192.168.251.133:44323","hostspec":"localhost","containerId":"hopeful_dijkstra","chartIds":["container-percont-cpu","container-percont-mem","container-total-cont-mem"]}]'
    const result = utils.getChartsFromQueryString(string)
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
})

