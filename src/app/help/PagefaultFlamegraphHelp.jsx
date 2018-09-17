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

export default function PagefaultFlamegraphHelp () {
  return (
    <div>
      <h4>Summary</h4>

      <p>Page fault flame graphs visualize code that is triggering page faults, which can explain application memory growth (the growth of resident set size: RSS). This widget works by tracing page faults on all running CPUs. It runs as a background task until the profile is completed.</p>

      <h4>Overhead</h4>

      <p>This should have low overhead while tracing, and then a short period (seconds) of a single CPU runtime at the end as symbols are collected and the flame graph generated. Page faults are usually a low rate activity, hence the low overhead. There are some exceptions: software builds that use hundreds of short-lived processes per second can have a much higher rate of page faults, as well as applications that are growing RSS quickly. In such cases, this task may have a higher overhead, not just for the extra CPU cycles, but also for the file system and storage I/O to store the trace data. If you suspect you have a high overhead case, test and measure overhead before production use.</p>

      <h4>Page Fault Tracing</h4>

      <p>This is one way to analyze memory growth, in this case, the growth of resident set size (RSS).</p>
      <p>Linux (like most operating systems) uses on-demand memory page allocation. When an application allocates memory (eg, malloc()), the operating system tracks the allocation but does not map physical memory to the process until it begins writing to it. At that point, the lie is revealed, and the processor&apos;s memory manangement unit (MMU) will &quot;fault&quot;, as there is no virtual-to-physical mapping for the requested address. The kernel handles the fault, and makes the mapping. This is a normal way that processes end up using main memory, and defers the cost of allocation to later on, and only for the pages (unit of memory) that are written to.</p>
      <p>Some applications pre-allocate memory (by which they mean touch it all &ndash; they write to it on startup so that it has mapped to physical memory). In those cases, RSS should be static, and this flame graph won&apos;t show many trace application events.</p>
      <p>To be clear about this: page fault tracing can explain memory growth where the application may end up being out-of-memory (OOM) killed. It usually can&apos;t explain memory leaks where the application ends up calling garbage collection more frequently, since in those cases the application may or may not be growing RSS. This can only see RSS growth.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is is, the more often it was present in the profile. The top edge shows what directly triggered page faults, and beneath it is its ancestry. Different color hues are used for different code types, and the saturation is randomized to differentiate between frames.</p>

      <CommonIssues />

      <ExternalResources targetUrl='http://www.brendangregg.com/FlameGraphs/memoryflamegraphs.html' text='Memory flame graphs'/>
    </div>
  )
}
