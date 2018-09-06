import React from 'react'

class CommonIssues extends React.PureComponent {
  render () {
    return (
      <div>
        <h4>Common Issues</h4>

        <p><b>Broken stacks:</b> If the runtime does not expose a stack walker that the profiler can use (commonly frame-pointer based), then stack traces will be broken and ancestry will be missing. This is usually visible as a &quot;bed of grass&quot;: thin frames all at the same level. The fix depends on the runtime and stack walking technique. Eg, to use frame-pointer walking with Java, Java must be run with -XX:+PreserveFramePointer.</p>

        <p><b>Missing frames:</b> This shows the native stack trace, after inlining. Runtimes like the JVM can inline as much as 70% of all frames, which will be missing from the flame graph. Vector has an uninlined CPU flame graph task that can reveal these missing frames.</p>

        <p><b>Missing symbols:</b> JIT runtimes need to export a symbol file for the profiler to use. This depends on the runtime. Java should be handled automatically by Vector, making use of perf-map-agent. Node.js currently needs to run with --perf_basic_prof_only_funcitons or --perf_basic_prof.</p>

        <p><b>ERROR PMCs not available on this instance (see help)</b>: This is commonly the case in the cloud. See the earlier PMCs section.</p>
      </div>
    )
  }
}

export default CommonIssues
