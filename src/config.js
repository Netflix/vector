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

const config = {
  basename: '/',

  dataWindows: [
    { text: '2 min', valueSeconds: 2*60 },
    { text: '5 min', valueSeconds: 5*60 },
    { text: '10 min', valueSeconds: 10*60 }
  ],
  pollIntervals: [
    { text: '1 sec', valueSeconds: 1 },
    { text: '2 sec', valueSeconds: 2 },
    { text: '3 sec', valueSeconds: 3 },
    { text: '5 sec', valueSeconds: 5 }
  ],
  defaultWindowSeconds: 120, // Default graph time window
  defaultIntervalSeconds: 2, // Default update interval

  enableContainerWidgets: true, // Enable container widgets
  enableCustomWidgetFeature: true, // Enable the custom widget feature to add ad-hoc widgets
  enableBcc: true, // Enable BCC widgets (requires BCC PMDA)
  enableFlamegraphs: true, // Enable Flamegraph widgets (requires custom PMDA)

  defaultProtocol: 'http', // PMWEBD protocol
  defaultPort: 7402, // PMWEBD port
  defaultHostspec: 'localhost', // Default PMCD hostspec
  disableHostspecInput: true, // Disable hostspec input
  disableContainerSelect: false, // Disable container name drop down select
  useCgroupId: false, // Use container cgroup id instead of container name

  // TODO what about container name resolver
}

if (typeof module !== 'undefined') {
  module.exports = config;
}
