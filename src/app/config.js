/**!
 *
 *  Copyright 2015 Netflix, Inc.
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
export default {
  'protocol': 'http', // PMWEBD protocol (http or https)
  'port': 7402,  // PMWEBD port
  'hostspec': 'localhost', // Default PMCD hostspec
  'interval': '2', // Default update interval in seconds
  'window': '2', // Default graph time window in minutes
  'enableFlameGraphs': true, // Enable flame graphs (requires extra PMDA)
  'enableBpfFlameGraphs': false, // Enable BFP extended flame graphs (requires extra PMDA)
  'enableContainerWidgets': true, // Enable container widgets
  'disableHostspecInput': false, // Disable hostspec input
  'disableContainerFilter': false, // Disable container id filter input
  'disableContainerSelect': false, // Disable container name drop down select
  'containerSelectOverride': true, // Overrides requireContainerFilter widget option
  'useCgroupId': false, // Use container cgroup id instead of container name
  'expandHostname': false, // Automatically expand hostname input when application opens
  'disableHostnameInputContainerSelect': false, // Disable hostname and hostspec input when container is selected
  'enableCustomWidgetFeature': true, // Enable the custom widget feature to add ad-hoc widgets
  'enableBcc': true, // Enable BCC widgets (requires BCC PMDA)
  'version': '[AIV]{version}[/AIV]', // version number, auto loaded by webpack from package.json

  windows: [
    { text: '2 min', valueSeconds: 2*60 },
    { text: '5 min', valueSeconds: 5*60 },
    { text: '10 min', valueSeconds: 10*60 }
  ],

  intervals: [
    { text: '1 sec', valueSeconds: 1 },
    { text: '2 sec', valueSeconds: 2 },
    { text: '3 sec', valueSeconds: 3 },
    { text: '5 sec', valueSeconds: 5 }
  ]
}
