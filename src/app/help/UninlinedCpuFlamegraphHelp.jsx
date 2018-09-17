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

import CommonIssues from './CommonIssues.jsx'
import ExternalResources from './ExternalResources.jsx'

export default function UninlinedCpuFlamegraphHelp () {
  return (
    <div>
      <h4>Summary</h4>

      <p>Uninlined CPU flame graphs visualize code that is consuming CPUs, and attempts to uninline application frames so that full stacks are shown (currently only supports Java). This widget works using a profiler that does timed sampling of stack traces at 49 Hertz, on all running CPUs. It runs as a background task until the profile is completed.</p>

      <h4>Overhead</h4>

      <p>This should have negligible overhead while profiling, and then a short period (seconds) of a single CPU runtime at the end as symbols are collected and the flame graph generated.</p>

      <h4>CPU Profiling</h4>

      <p>Timed sampling of stack traces is a common industry method for understanding CPU usage with low overhead. This is different to tracing of all functions/methods, which is performed by some CPU profilers and costs high overhead and often skews results (observer effect).</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is is, the more often it was present in the profile. The top edge shows what is on-CPU, and beneath it is its ancestry. Different color hues are used for different code types, and the saturation is randomized to differentiate between frames.</p>

      <CommonIssues />

      <ExternalResources targetUrl='http://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html' text='CPU Flame Graphs' />

    </div>
  )
}
