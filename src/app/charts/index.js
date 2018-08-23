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

/* eslint-disable */

import { flatten } from '../processors/utils'

// all the remaining components, particularly vector specific angular components
function requireAll(requireContext) {
  const validKeys = requireContext.keys().filter(f => f !== './index.js')
  const requires = validKeys.map(requireContext)
  return Array.isArray(requires) ? requires : [requires]
}

const requires = requireAll(require.context('./', false, /\.js$/))
const charts = requires.map(r => r.default).reduce(flatten, [])

export default charts

// TODO automatically reconnect if a context goes away, but host and port are valid
// TODO set up url # parameter and parser to allow reconstruction of sharing links
// TODO refactor chart/heatmap/table/simpletable, shared parent component
// TODO performance review with react perf tools, lots of double and triple renders
// TODO stacked area chart with semiotic: datesForUnique is slow performance
// TODO switch to a proper grid view
// TODO plenty more tests
// TODO add flame graphs (maybe not?)
// TODO enable vector to browse and collect cluster information from external sources, or trigger based - needs to be pluggable, eg from k8s/titus/etc
