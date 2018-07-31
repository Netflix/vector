import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstancesForMetric,
} from './utils'

import {
  defaultTitleAndKeylabel,
  cumulativeTransform,
  mathAllValues,
  toPercentage,
} from './transforms'

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, chartInfo, context) {
  const instances = extractInstancesForMetric(datasets, chartInfo.metricNames)
  if (instances.length == 0) return null

  // create an entry for each instance name
  const data = instances
    .map(({ metric, instance }) => ({
      metric,
      instance,
      data: datasets
        .map(ds => ({
          ts: createTimestampFromDataset(ds),
          value: extractValueFromChartDataForInstance(ds, metric, instance)
        }))
        .filter(ds => ds.value !== null)
    }))

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
  // TODO move this logic into the modal (?) and then collapse customModel into simpleModel
  let transforms = []
  transforms.push(defaultTitleAndKeylabel)
  if (chartInfo.cumulative) {
    transforms.push(cumulativeTransform)
  }
  if (chartInfo.converted && chartInfo.conversionFunction) {
    const conversionFunction = new Function('value', 'return ' + chartInfo.conversionFunction + ';')
    transforms.push(mathAllValues(conversionFunction))
  }
  if (chartInfo.percentage) {
    transforms.push(toPercentage)
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
