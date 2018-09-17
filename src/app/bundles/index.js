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

import React from 'react'

const bundles = [
  {
    name: 'Host Utilization',
    iconName: 'computer',
    description: (<div>
      Quick overview of host utilization (not container):
      <ul>
        <li>CPU utilization</li>
        <li>Disk latency</li>
        <li>Memory utilization</li>
        <li>Network throughput</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'cpu-utilization' },
      { chartId: 'disk-latency' },
      { chartId: 'memory-utilization' },
      { chartId: 'network-throughput' },
    ]
  },
  {
    name: 'Container app',
    iconName: 'clone',
    description: (<div>
      A set of metrics for monitoring performance of your container
      <ul>
        <li>Container CPU</li>
        <li>Container MEM usage (MB & %)</li>
        <li>Container Disk IOPS</li>
        <li>Container Disk IOPS throttled</li>
        <li>Container CPU throttled</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'container-percont-cpu' },
      { chartId: 'container-percont-mem' },
      { chartId: 'container-disk-iops' },
      { chartId: 'container-disk-iops-throttle' },
      { chartId: 'container-percont-cpu-throttle' },
      { chartId: 'container-percont-mem-util', },
    ],
  },
  {
    name: 'Disk',
    iconName: 'disk',
    description: (<div>
      Key disk metrics
      <ul>
        <li>IOPS</li>
        <li>Latency</li>
        <li>Throughput</li>
        <li>Utilization</li>
      </ul>
    </div>),
    chartTemplates: [
      { chartId: 'disk-iops' },
      { chartId: 'disk-latency' },
      { chartId: 'disk-throughput' },
      { chartId: 'disk-utilization' }
    ],
  },
  {
    name: 'Flamegraphs',
    iconName: 'hotjar',
    description: 'Flame graphs',
    chartTemplates: [
      { chartId: 'fg-cpu' },
      { chartId: 'fg-pname-cpu' },
      { chartId: 'fg-uninlined-cpu' },
      { chartId: 'fg-pagefault' },
      { chartId: 'fg-diskio' },
      { chartId: 'fg-ipc' },
    ]
  },
  {
    name: 'BCC demo',
    iconName: 'microchip',
    description: 'A collection showing the default configured BCC PMDA metrics, make sure you have the BCC PMDA installed.',
    chartTemplates: [
      {
        chartId: 'text-label',
        content: 'The default BCC widgets. To enable more widgets, on the target host, check the BCC PMDA configuration file and run ./Install to reload.',
      },
      { chartId: 'bcc-tcptop' },
      { chartId: 'bcc-runqlat' },
      { chartId: 'bcc-biolatency' },
      { chartId: 'bcc-tracepoint-hits' },
      { chartId: 'bcc-usdt-hits' },
    ]
  }
]

export default bundles
