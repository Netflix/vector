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

import simpleModel from '../processors/simpleModel'
import { defaultTitleAndKeylabel } from '../processors/transforms'
import { integer } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'

export default [
  {
    chartId: 'network-tcp-closewait',
    group: 'Network',
    title: 'TCP Connections (Close Wait)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp-established',
    group: 'Network',
    title: 'TCP Connections (Established)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.established',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp',
    group: 'Network',
    title: 'TCP Connections',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.established',
      'network.tcpconn.time_wait',
      'network.tcpconn.close_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'network-tcp-timewait',
    group: 'Network',
    title: 'TCP Connections (Time Wait)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'network.tcpconn.time_wait',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  }
]
