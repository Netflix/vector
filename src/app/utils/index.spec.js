/**!
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

import * as utils from './'
import { expect } from 'chai'
import config from 'config'

describe('getChartsFromLocation', () => {
  describe('with new style search string', () => {
    const search = '?q=[{"p":"http","h":"192.168.251.133:44323","hs":"localhost","ci":"_all","cl":["cpu-pswitch"]},{"p":"http","h":"1.2.3.4:7402","hs":"localhost","ci":"_all","cl":[]},{"p":"https","h":"192.168.251.133:44323","hs":"localhost","ci":"hopeful_dijkstra","cl":["container-percont-cpu","container-percont-mem","container-total-cont-mem"]}]'
    const result = utils.getChartsFromLocation({ search, hash: null })
    it('finds three targets', () => {
      expect(result.targets.length).to.equal(3)
      expect(result.targets).to.have.deep.members([
        { protocol: 'http', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: '_all' },
        { protocol: 'https', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' },
        { protocol: 'http', hostname: '1.2.3.4:7402', hostspec: 'localhost', containerId: '_all' },
      ])
    })

    it('finds four charts in the chartlist', () => {
      expect(result.chartlist.length).to.equal(4)
      expect(result.chartlist).to.have.deep.members([
        { target: { protocol: 'http', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: '_all' }, chartId: 'cpu-pswitch' },
        { target: { protocol: 'https', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-percont-cpu' },
        { target: { protocol: 'https', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-percont-mem' },
        { target: { protocol: 'https', hostname: '192.168.251.133:44323', hostspec: 'localhost', containerId: 'hopeful_dijkstra' }, chartId: 'container-total-cont-mem' },
      ])
    })
  })

  describe('with new style search string, no protocol specified', () => {
    const search = '?q=[{"h":"192.168.251.133:44323","hs":"localhost","ci":"_all","cl":["cpu-pswitch"]},{"h":"1.2.3.4:7402","hs":"localhost","ci":"_all","cl":[]},{"h":"192.168.251.133:44323","hs":"localhost","ci":"hopeful_dijkstra","cl":["container-percont-cpu","container-percont-mem","container-total-cont-mem"]}]'
    const result = utils.getChartsFromLocation({ search, hash: null })
    it('finds three targets, all with the default protocol', () => {
      expect(result.targets.length).to.equal(3)
      result.targets.forEach(i => expect(i.protocol).to.equal(config.defaultProtocol))
    })

    it('finds four charts in the chartlist, all with targets having the default protocol', () => {
      expect(result.chartlist.length).to.equal(4)
      result.chartlist.forEach(i => expect(i.target.protocol).to.equal(config.defaultProtocol))
    })
  })

  describe('with old style hash string', () => {
    describe('with a container', () => {
      const hash = '#/?host=100.65.15.127&container=09fb4cae-8987-49bc-a208-1115aa0443e1'
      const result = utils.getChartsFromLocation({ search: null, hash })
      it('finds a single target with a container', () => {
        expect(result.targets.length).to.equal(1)
        expect(result.targets).to.have.deep.members([
          { protocol: 'http', hostname: '100.65.15.127:7402', hostspec: 'localhost', containerId: '09fb4cae-8987-49bc-a208-1115aa0443e1' }
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
          { protocol: 'http', hostname: '100.82.47.121:7402', hostspec: 'localhost', containerId: '_all' }
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

