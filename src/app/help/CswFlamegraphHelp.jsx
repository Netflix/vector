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

export default function CswFlamegraphHelp() {
  return (
    <div>
      <h4>Summary</h4>

      <p>Context switch flame graphs visualize code paths that block and wait off-CPU, such as for I/O and lock contention. This widget works by tracing scheduler context switches, then aggregating stack traces in kernel context for efficency using eBPF. Despite this, scheduler events are high frequency, and even tracing them in an efficient way may still cost some noticable overhead. This visualization shows the number of context switches. This runs as a background task until the trace is completed.</p>

      <h4>Prerequisites: BPF Stacks</h4>

      <p>This instrumentation requires BPF stack trace support, which arrived in the Linux 4.6 kernel.</p>

      <h4>Overhead</h4>

      <p>This instruments scheduler events, which can be very high frequency: tens of millions of events per second. While the instrumentation has been optimized using eBPF to be efficient, adding some CPU cycles to each event will add up, and for high rates of events may begin to cost noticable overhead. Because of this, the default duration is ten seconds instead of one minute. If you are unsure of the overhead effect, use in a test environment before production use.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is, the more frequently it was present in a code path that led to a block (regardless of the blocking duration). The top edge shows what blocked, and beneath it is its ancestry. The color is blue to indicate blocked time, and the saturation value is randomized to differentiate between frames.</p>

      <h4>Interpretation &amp; Actionable Items</h4>

      <p>This shows code paths that lead to blocking and waiting off-CPU, such as for disk I/O or lock contention. Ideally these can be minimized. Look for the widest stacks and investigate them first. To understand the duration that these spent off-CPU, use the off-CPU time flame graph.</p>

      <p>The actionable fix depends on the code path. Disk I/O can be improved by reconfiguring the workloads on the system to allow for a larger file system cache, or switching to an instance with faster disks. Lock contention may be reduced by tuning thread pools to smaller counts, or by the developer modifying the code.</p>

      <CommonIssues />

      <ExternalResources />

    </div>
  )
}
