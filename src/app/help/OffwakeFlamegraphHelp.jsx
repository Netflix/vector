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

export default function PackagenameCpuFlamegraphHelp() {
  return (
    <div>
      <h4>Summary</h4>

      <p>Off-Wake time flame graphs visualize code paths that block and wait off-CPU, such as for I/O and lock contention, and include both the blocked stack and the waker stack. This is an advanced visualization that works by tracing blocking and wakeup scheduler events, then associating and aggregating stack traces in kernel context for efficency using eBPF. Despite this, scheduler events are high frequency, and even tracing them in an efficient way may still cost some noticable overhead. This runs as a background task until the trace is completed.</p>

      <h4>Prerequisites: BPF Stacks</h4>

      <p>This instrumentation requires BPF stack trace support, which arrived in the Linux 4.6 kernel.</p>

      <h4>Overhead</h4>

      <p>This instruments scheduler switch and wakeup events, which can be very high frequency: tens of millions of events per second, and saves wakeup stacks in kernel memory to associate with blocked stacks. While the instrumentation has been optimized using eBPF to be efficient, adding some CPU cycles and memory usage to each event will add up, and for high rates of events this may cost significant overhead. Because of this, the default duration is five seconds instead of one minute. If you are unsure of the overhead effect, use in a test environment before production use.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is, the more often it was present in the trace of off-CPU time. The saturation value is randomized to differentiate between frames.</p>

      <p>In shades of blue, and up until a &quot;--&quot; delimiter frame, is the blocking (off-CPU) stack trace. The top frame of this shows what blocked, and beneath it is its ancestry. The very bottom frame is the process name. The width is how long it was blocked off-CPU.</p>

      <p>In shades of aqua, above a &quot;--&quot; delimiter frame, is the wakeup stack trace. This is in reverse order, so the bottom frame is the top of the stack which did the wakeup, and everything above it is ancestry. This reversing allows the wakeup frame to meet the blocked frame that it woke up in the middle. The very top frame is the process name that did the wakeup.</p>

      <h4>Interpretation &amp; Actionable Items</h4>

      <p>Look for applications of interest (the process name is the bottom frame), and then brows its blocked stacks from the widest to the thinnest. There will likely be many paths that are the application waiting for work, and so the stack trace is not interesting. Those are often the widest. Look for paths that occur during an application request, such as for lock contention and disk I/O. You can browse the wakeup stacks for more context on why something was blocked.</p>

      <p>The actionable fix depends on the code path. Disk I/O time can be improved by reconfiguring the workloads on the system to allow for a larger file system cache, or switching to an instance with faster disks. Lock contention may be reduced by tuning thread pools to smaller counts, or by the developer modifying the code.</p>

      <CommonIssues />
      <ExternalResources targetUrl='http://www.brendangregg.com/blog/2016-02-01/linux-wakeup-offwake-profiling.html' text='Linux Wakeup and Off-Wake Profiling' />
    </div>
  )
}
