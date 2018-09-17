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
import { timesliceCalculations, defaultTitleAndKeylabel, cumulativeTransform, kbToGb } from '../processors/transforms'
import { integer } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'

export default [
  {
    chartId: 'memory-utilization-cached',
    group: 'Memory',
    title: 'Memory Utilization (Cached)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'mem.util.cached',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      kbToGb(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'memory-utilization-free',
    group: 'Memory',
    title: 'Memory Utilization (Free)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'mem.util.free',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      kbToGb(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'memory-utilization',
    group: 'Memory',
    title: 'Memory Utilization',
    processor: simpleModel,
    visualisation: Chart,
    lineType: 'stackedarea',
    metricNames: [
      'mem.util.cached',
      'mem.util.used',
      'mem.util.free',
      'mem.util.bufmem',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      kbToGb(),
      timesliceCalculations({
        'free (unused)': (slices) => ({ '-1': slices['mem.util.free']['-1'] }),
        'free (cache)': (slices) => ({ '-1': slices['mem.util.cached']['-1'] + slices['mem.util.bufmem']['-1'] }),
        'application': (slices) => ({ '-1': slices['mem.util.used']['-1'] - slices['mem.util.cached']['-1'] - slices['mem.util.bufmem']['-1'] }),
      }),
      defaultTitleAndKeylabel(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'memory-utilization-used',
    group: 'Memory',
    title: 'Memory Utilization (Used)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'mem.util.used',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      kbToGb(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'memory-page-faults',
    group: 'Memory',
    title: 'Page Faults',
    processor: simpleModel,
    visualisation: Chart,
    lineType: 'stackedarea',
    metricNames: [
      'mem.vmstat.pgfault',
      'mem.vmstat.pgmajfault',
    ],
    transforms: [
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },
]
