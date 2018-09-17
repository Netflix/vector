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

import {
  transformRawDataToPipelineData,
} from './modelUtils'

import {
  defaultTitleAndKeylabel,
  cumulativeTransform,
  mathAllValues,
} from './transforms'

/**
 * Extracts all required data for a chart from the input datasets. Constructs the
 * transform pipeline from the chart configuration at runtime.
 */
function calculateChart(datasets, chartInfo, context) {
  const data = transformRawDataToPipelineData(datasets, chartInfo)
  if (data === null || data.length === 0) return null

  const transforms = constructTransformPipeline(chartInfo)

  let transformed = data
  transforms.forEach(fn => {
    transformed = fn(transformed, context)
  })
  return transformed
}

/**
 * Creates the transform pipeline for the custom metric
 */
function constructTransformPipeline(chartInfo) {
  let transforms = []
  transforms.push(defaultTitleAndKeylabel())
  if (chartInfo.cumulative) {
    transforms.push(cumulativeTransform())
  }
  if (chartInfo.converted && chartInfo.conversionFunction) {
    const conversionFunction = new Function('value', 'return ' + chartInfo.conversionFunction + ';')
    transforms.push(mathAllValues(conversionFunction))
  }
  return transforms
}

function requiredMetricNames(chartInfo) {
  return chartInfo.metricNames || null
}

export default {
  calculateChart,
  requiredMetricNames
}
