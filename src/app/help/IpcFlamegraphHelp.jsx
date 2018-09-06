import React from 'react'

import CommonIssues from './CommonIssues.jsx'
import ExternalResources from './ExternalResources.jsx'

export default function IpcFlamegraphHelp () {
  return (
    <div>
      <h4>Summary</h4>

      <p>IPC flame graphs visualize code that is consuming CPUs, and uses a color spectrum to indicate the instructions-per-cycle (IPC) for individual functions: red means instruction heavier, and blue means cycle heavier (usually stall cycles). This widget works by using a profiler that does overflow-based sampling of stack traces for CPU cycle and instruction events via performance monitoring counters (PMCs), on all running CPUs. Only one in 100 million events are sampled. This runs as a background task until the profile is completed. This only works if PMCs are available on the server, which for many cloud instance types will not be.</p>

      <h4>Overhead</h4>

      <p>This should have negligible overhead while profiling, and then a short period (seconds) of a single CPU runtime at the end as symbols are collected and the flame graph generated.</p>

      <h4>PMCs</h4>

      <p>Performance monitoring counters (PMCs) are special programmable hardware counters that report low-level processor behavior. In many cloud environments they are currently disabled. They should currently be available for the largest instance types on AWS EC2. To test at the command line, on Linux, run &quot;perf stat ls&quot; and see if the cycles and instructions counters are measured (if not, they will report &quot;&lt;not supported&gt;&quot;).</p>

      <h4>IPC Profiling</h4>

      <p>Instructions-per-cycle (IPC) is a PMC-based metric commonly used as a starting point for understanding for low-level CPU behavior, particularly whether code is limited by the speed of instruction execution or other resources (usually main memory). The higher the IPC, the more quickly the processor is completing instructions (aka &quot;retiring&quot; instructions). The are many more PMCs for providing more information when desired.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is, the more often it was present in the profile of CPU cycles (equivalent to a CPU flame graph). The top edge shows what is on-CPU, and beneath it is its ancestry. Different color hues are used to show the range of IPC values present in the profile, from red (more instruction heavy) to blue (more cycle heavy). The color spectrum is relative to each flame graph, so the most blue frame in one flame graph may have a different IPC to the most blue frame in another. The gloabal IPC value for the flame graph is shown in the subtitle.</p>

      <h4>Interpretation &amp; Actionable Items</h4>

      <p>If functions are colored red, they are instruction heavy (with a high IPC), if they are colored blue, they are cycle heavy (a low IPC) and likely stalled on memory I/O.</p>
      <p>Examples of instruction optimizations:</p>
      <ul>
        <li>&ndash; by the system administrator: choosing systems with faster processors, disabling hyperthreads, reducing CPU contention.</li>
        <li>&ndash; by the developer: finding and eliminating unnecessary work, using faster algorithms.</li>
      </ul>
      <p>Examples of memory I/O optimizations:</p>
      <ul>
        <li>&ndash; by the system administrator: using different system NUMA settings, using different memory settings including large pages, and choosing systems with larger CPU caches or with faster main memory.</li>
        <li>&ndash; by the developer: changing the code to do fewer memory copies and object allocations, and using more memory efficient data structures.</li>
      </ul>
      <p>As for the IPC value shown in the subtitle: interpreting this depends on the processor and its superscalar retire width. For example, many modern processors can retire four instructions with every cycle, which means its top speed IPC is 4.0 (when executing NOPs). For a production workload that involves memory I/O, an IPC of 1.5 may be considered good (it depends).</p>

      <CommonIssues />

      <ExternalResources targetUrl='http://www.brendangregg.com/blog/2014-10-31/cpi-flame-graphs.html' text='CPI Flame Graphs (cpi is IPC inverted)' />
    </div>
  )
}
