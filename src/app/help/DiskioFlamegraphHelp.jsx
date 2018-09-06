import React from 'react'

import CommonIssues from './CommonIssues.jsx'
import ExternalResources from './ExternalResources.jsx'

export default function DiskioFlamegraphHelp () {
  return (
    <div>
      <h4>Summary</h4>

      <p>Disk I/O flame graphs visualize code that directly requested disk I/O, helping explain the cause of disk I/O. This widget works by tracing whenever a disk I/O event is enqueued. It runs as a background task until the profile is completed.</p>

      <h4>Overhead</h4>

      <p>This should have low overhead while tracing, and then a short period (seconds) of a single CPU runtime at the end as symbols are collected and the flame graph is generated. Relative to other events, disk I/O is usually a low rate activity, hence the low overhead. There are some exceptions: a large database server may be calling tens of thousands of disk I/O per second, which will have a higher overhead to trace, not just for the extra CPU cycles, but also for the file system and storage I/O to store the trace data. If you suspect you have a high overhead case, test and measure overhead before production use.</p>

      <h4>Disk I/O Tracing</h4>

      <p>The intent here is to show which code paths are causing disk I/O. It workes by tracing when disk I/O events are inserted on a storage queue to be later issued to the device. (This uses the Linux tracepoint: block:block_rq_insert.) This approach is simple and usually identifies the code path of interest. There are worse approaches: for example, mesauring when the disk I/O actually begins, which is often asynchronous to the request, and so does not identify the code path of interest.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis shows stack depth. Each rectangle represents a stack frame. The wider a frame is is, the more often it was present in the profile. The top edge shows what directly triggered a disk I/O request to be queued, and beneath it is its ancestry. The x-axis width is relative to the number of I/O. Different color hues are used for different code types, and the saturation is randomized to differentiate between frames.</p>

      <CommonIssues />

      <ExternalResources targetUrl='http://www.brendangregg.com/FlameGraphs/memoryflamegraphs.html' text='Memory Flame Graphs' />

    </div>
  )
}
