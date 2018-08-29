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

import { flatten } from '../utils'

// all the remaining components, particularly vector specific angular components
function requireAll(requireContext) {
  const validKeys = requireContext.keys().filter(f => f !== './index.js')
  const requires = validKeys.map(requireContext)
  return Array.isArray(requires) ? requires : [requires]
}

function isValidChart(chart, index, charts) {
  let errors = []
  if (!chart.chartId) {
    errors.push('chart is missing chartId')
  }
  if (!chart.group || !chart.title) {
    errors.push('chart is missing group or title')
  }
  if (!chart.processor) {
    errors.push('chart processor is not valid')
  }
  if (charts.findIndex(c => c.chartId === chart.chartId) !== index) {
    errors.push('found a duplicate chartId')
  }

  if (errors.length) {
    console.warn('chart had errors, will not be loaded', chart, errors)
  }
  return !errors.length
}

const requires = requireAll(require.context('./', false, /\.js$/))
const charts = requires
  .map(r => r.default)
  .reduce(flatten, [])
  .filter(isValidChart)

export default charts

// TODO set up url # parameter and parser to allow reconstruction of sharing links
// / -> MainController, widgets:defaultWidgets, embed:false
// /embed -> MainController, widgets:defaultWidgets, embed:true
// /empty -> MainController, widgets:emptyWidgets, embed:false
// /container -> MainController, widgets:containerWidgets, embed:false
// otherwise -> /

// new functionality will be
// /* to main
// /embed to a page without the wrappers, will rely on the url to setup correctly

// TODO automatically reconnect if a context goes away, but host and port are valid
// TODO flag error if context could not be selected
// TODO plenty more tests
// TODO add flame graphs (maybe not?)
// TODO enable vector to browse and collect cluster and container information from external sources
// - needs to be pluggable, eg from k8s/titus/etc
