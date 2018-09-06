import React from 'react'

import CommonIssues from './CommonIssues.jsx'
import ExternalResources from './ExternalResources.jsx'

export default function OffcpuFlamegraphHelp () {
  return (
    <div>
      <h4>Summary</h4>

      <p>Off-CPU time flame graphs visualize code paths that block and wait off-CPU, such as for I/O and lock contention, and is a complementary visualization to CPU flame graphs. This widget works by tracing scheduler context switches, then aggregating stack traces in kernel context for efficency using eBPF. Despite this, scheduler events are high frequency, and even tracing them in an efficient way may still cost some noticable overhead. This runs as a background task until the trace is completed.</p>

      <h4>Prerequisites: BPF Stacks</h4>

      <p>This instrumentation requires BPF stack trace support, which arrived in the Linux 4.6 kernel.</p>

      <h4>Overhead</h4>

      <p>This instruments scheduler events, which can be very high frequency: tens of millions of events per second. While the instrumentation has been optimized using eBPF to be efficient, adding some CPU cycles to each event will add up, and for high rates of events may begin to cost noticable overhead. Because of this, the default duration is ten seconds instead of one minute. If you are unsure of the overhead effect, use in a test environment before production use.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is, the more often it was present in the trace of off-CPU time. The top edge shows what blocked, and beneath it is its ancestry. The color is blue to indicate blocked time, and the saturation value is randomized to differentiate between frames.</p>

      <h4>Interpretation &amp; Actionable Items</h4>

      <p>Look for applications of interest (the process name is the bottom frame), and then brows its blocked stacks from the widest to the thinnest. There will likely be many paths that are the application waiting for work, and so the stack trace is not interesting. Those are often the widest. Look for paths that occur during an application request, such as for lock contention and disk I/O.</p>

      <p>The actionable fix depends on the code path. Disk I/O time can be improved by reconfiguring the workloads on the system to allow for a larger file system cache, or switching to an instance with faster disks. Lock contention may be reduced by tuning thread pools to smaller counts, or by the developer modifying the code.</p>

      <CommonIssues />
      <ExternalResources targetUrl='http://www.brendangregg.com/blog/2016-01-20/ebpf-offcpu-flame-graph.html' text='Linux eBPF Off-CPU Flame Graphs' />
    </div>
  )
}
