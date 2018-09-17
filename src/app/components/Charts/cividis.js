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

/*
// https://github.com/plotly/plotly.py/pull/883/files
const cividis = [
  [0.000000, 'rgb(0,32,76)'], [0.058824, 'rgb(0,42,102)'],
  [0.117647, 'rgb(0,52,110)'], [0.176471, 'rgb(39,63,108)'],
  [0.235294, 'rgb(60,74,107)'], [0.294118, 'rgb(76,85,107)'],
  [0.352941, 'rgb(91,95,109)'], [0.411765, 'rgb(104,106,112)'],
  [0.470588, 'rgb(117,117,117)'], [0.529412, 'rgb(131,129,120)'],
  [0.588235, 'rgb(146,140,120)'], [0.647059, 'rgb(161,152,118)'],
  [0.705882, 'rgb(176,165,114)'], [0.764706, 'rgb(192,177,109)'],
  [0.823529, 'rgb(209,191,102)'], [0.882353, 'rgb(225,204,92)'],
  [0.941176, 'rgb(243,219,79)'], [1.000000, 'rgb(255,233,69)']
]
*/

// use a slight variation on cividis, since
// (1) we want the unset cells to by white, rather than dark blue
// (2) we need the top of the range to be unset domain, for d3 scaleThreshold
const cividis = [
  [0.000001, 'rgb(255,255,255)'],
  [0.058824, 'rgb(0,42,102)'],
  [0.117647, 'rgb(0,52,110)'],
  [0.176471, 'rgb(39,63,108)'],
  [0.235294, 'rgb(60,74,107)'],
  [0.294118, 'rgb(76,85,107)'],
  [0.352941, 'rgb(91,95,109)'],
  [0.411765, 'rgb(104,106,112)'],
  [0.470588, 'rgb(117,117,117)'],
  [0.529412, 'rgb(131,129,120)'],
  [0.588235, 'rgb(146,140,120)'],
  [0.647059, 'rgb(161,152,118)'],
  [0.705882, 'rgb(176,165,114)'],
  [0.764706, 'rgb(192,177,109)'],
  [0.823529, 'rgb(209,191,102)'],
  [0.882353, 'rgb(225,204,92)'],
  [0.941176, 'rgb(243,219,79)'],
  [undefined, 'rgb(255,233,69)']
]

const _thresholds = cividis.map(v => v[0])
const _colors = cividis.map(v => v[1])

export const thresholds = _thresholds
export const colors = _colors
