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
import Flamegraph from '../components/Charts/Flamegraph.jsx'
import { onlyLatestValues } from '../processors/transforms'

import CpuFlamegraphHelp from '../help/CpuFlamegraphHelp.jsx'
import PackagenameCpuFlamegraphHelp from '../help/PackagenameCpuFlamegraphHelp.jsx'
import UninlinedCpuFlamegraphHelp from '../help/UninlinedCpuFlamegraphHelp.jsx'
import PagefaultFlamegraphHelp from '../help/PagefaultFlamegraphHelp.jsx'
import DiskioFlamegraphHelp from '../help/DiskioFlamegraphHelp.jsx'
import IpcFlamegraphHelp from '../help/IpcFlamegraphHelp.jsx'
import CswFlamegraphHelp from '../help/CswFlamegraphHelp.jsx'
import OffcpuFlamegraphHelp from '../help/OffcpuFlamegraphHelp.jsx'
import OffwakeFlamegraphHelp from '../help/OffwakeFlamegraphHelp.jsx'

export default function _charts(config) {
  if (!config.enableFlamegraphs) return []

  return [
    {
      chartId: 'fg-cpu',
      group: 'Flamegraphs',
      title: 'CPU',
      helpComponent: CpuFlamegraphHelp,
      tooltipText: 'Flamegraph of process time on CPU',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.cpuflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-pname-cpu',
      group: 'Flamegraphs',
      title: 'Package name CPU',
      helpComponent: PackagenameCpuFlamegraphHelp,
      tooltipText: 'Flamegraph of process time on CPU, collapsed Java frames to package level',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.pnamecpuflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-uninlined-cpu',
      group: 'Flamegraphs',
      title: 'Uninlined CPU',
      helpComponent: UninlinedCpuFlamegraphHelp,
      tooltipText: 'Flamegraph of process time on CPU, without inlining',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.uninlinedcpuflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-pagefault',
      group: 'Flamegraphs',
      title: 'Page faults',
      helpComponent: PagefaultFlamegraphHelp,
      tooltipText: 'Show call stacks on CPU during page faults',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.pagefaultflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-diskio',
      group: 'Flamegraphs',
      title: 'Disk I/O',
      helpComponent: DiskioFlamegraphHelp,
      tooltipText: 'Show disk I/O',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.diskioflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-ipc',
      group: 'Flamegraphs',
      title: 'IPC',
      helpComponent: IpcFlamegraphHelp,
      tooltipText: 'Inter-process call flame graph',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.ipcflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
    },

    {
      chartId: 'fg-csw',
      group: 'Flamegraphs',
      title: 'CSW',
      helpComponent: CswFlamegraphHelp,
      tooltipText: 'Context switch flame graph',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.cswflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
      isHighOverhead: true,
    },

    {
      chartId: 'fg-offcpu',
      group: 'Flamegraphs',
      title: 'Off CPU time',
      helpComponent: OffcpuFlamegraphHelp,
      tooltipText: 'Off CPU time flame graph',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.offcpuflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
      isHighOverhead: true,
    },

    {
      chartId: 'fg-offwake',
      group: 'Flamegraphs',
      title: 'Off wake time',
      helpComponent: OffwakeFlamegraphHelp,
      tooltipText: 'Off wake time flame graph',
      isContainerAware: true,
      processor: simpleModel,
      visualisation: Flamegraph,
      metricNames: [
        'vector.task.offwakeflamegraph',
      ],
      transforms: [
        onlyLatestValues(),
      ],
      isHighOverhead: true,
    },
  ]
}
