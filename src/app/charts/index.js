/**!
 *
 *  Copyright 2015 Netflix, Inc.
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
import cumulativeModel from '../processors/cumulativeModel'
import cpuRatioModel from '../processors/cpuRatioModel'

import HelpFlamegraph from '../help/Flamegraph.jsx'
import FilterModal from '../components/FilterModal/FilterModal.jsx'

export default [
  {
    group: 'CPU',
    title: 'Load Average',
    processor: simpleModel,
    config: {
      metricName: 'kernel.all.load',
    },
  },
  {
    group: 'CPU',
    title: 'CPU Utilization (User)',
    processor: cpuRatioModel,
    config: {
      metricName: 'kernel.all.cpu.user',
      divisorMetricName: 'hinv.ncpu'
    },
  },
  {
    group: 'CPU',
    title: 'CPU Utilization (System)',
    processor: cpuRatioModel,
    config: {
      metricName: 'kernel.all.cpu.sys',
      divisorMetricName: 'hinv.ncpu'
    },
  },
  {
    group: 'CPU',
    title: 'Context Switches per second',
    processor: cumulativeModel,
    config: {
      metricName: 'kernel.all.pswitch',
    },
    settings: {
      filter: ''
    },
    isContainerAware: true,
    isHighOverhead: true,
    helpComponent: HelpFlamegraph,
    settingsComponent: FilterModal,
  }
]
