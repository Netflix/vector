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
import { mapInstanceDomains, defaultTitleAndKeylabel, divideBy, cumulativeTransform } from '../processors/transforms'
import { percentage, integer, number } from '../processors/formats'
import Chart from '../components/Charts/Chart.jsx'

export default [
  {
    chartId: 'disk-iops',
    group: 'Disk',
    title: 'Disk IOPS',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'disk.dev.read',
      'disk.dev.write',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'disk-latency',
    group: 'Disk',
    title: 'Disk Latency',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'disk.dev.read_rawactive',
      'disk.dev.write_rawactive',
      'disk.dev.read',
      'disk.dev.write',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: number,
  },

  {
    chartId: 'disk-throughput',
    group: 'Disk',
    title: 'Disk Throughput (Bytes)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'disk.dev.read_bytes',
      'disk.dev.write_bytes',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      cumulativeTransform(),
    ],
    yTickFormat: integer,
  },

  {
    chartId: 'disk-utilization',
    group: 'Disk',
    title: 'Disk Utilization (%)',
    processor: simpleModel,
    visualisation: Chart,
    metricNames: [
      'disk.dev.avactive',
    ],
    transforms: [
      mapInstanceDomains(),
      defaultTitleAndKeylabel(),
      divideBy(1000),
      cumulativeTransform(),
    ],
    yTickFormat: percentage,
  },
]
