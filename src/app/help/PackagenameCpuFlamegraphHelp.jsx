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

      <p>Package name flame graphs visualize code that is directly consuming CPUs, and visualizes this as a hierarchy based on the package name (currently only supports Java package names). This widget works using a profiler that does timed sampling of the instruction pointer at 49 Hertz, on all running CPUs. This does not need the application to support stack traces, as it only measures the running function (ie, for Java, this does not need -XX:+PreserveFramePointer, so this can be useful for analyzing applications that are running without it). It runs as a background task until the profile is completed.</p>

      <h4>Overhead</h4>

      <p>This should have negligible overhead while profiling, and then a short period (seconds) of a single CPU runtime at the end as symbols are collected and the flame graph generated.</p>

      <h4>CPU IP Profiling</h4>

      <p>Timed sampling of the instruction pointer (aka program counter) is a common industry method for understanding CPU usage with very low overhead. This is different to tracing of all functions/methods, which is performed by some CPU profilers and costs high overhead and often skews results (observer effect). This is also different to profiling stack traces, as is typical with flame graphs. In this case, the stack trace is not collected, so code ancestry is not known or shown. The advantage is a different view of CPU consumption, that can be used in addition to normal flame graphs.</p>

      <h4>Flame Graph Visualization</h4>

      <p>The x-axis shows the stack profile population, sorted alphabetically (it is not the passage of time), and the y-axis in this case traverses components of the function or method package name. Each rectangle represents a component of the function or method name. The wider a frame is is, the more often it was present in the profile. The top edge shows the functions that are on-CPu, and beneath them are the larger package groups that they belong to. Different color hues are used for different code types, and the saturation is randomized to differentiate between frames.</p>

      <CommonIssues />

      <ExternalResources targetUrl='http://www.brendangregg.com/blog/2017-06-30/package-flame-graph.html' text='Package name flame graphs' />

    </div>
  )
}
