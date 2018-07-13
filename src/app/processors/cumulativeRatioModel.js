import { flatten, uniqueFilter, createTimestampFromDataset } from './utils'

function extractValueFromChartData(dataset, metricName) {
  // given a single pmweb fetch result, traverse the metricName -> instances -> value hierarchy to get a specific value
  return dataset.values
    .filter(v => v.name === metricName).reduce(flatten)
    .instances[0]
    .value
}

function extractValueFromChartDataForInstance(dataset, metricName, instanceName) {
  // given a single pmweb fetch result, traverse the metricName -> instances -> value hierarchy to get a specific value
  return dataset.values
    .filter(v => v.name === metricName).reduce(flatten)
    .instances
    .filter(i => instanceName ? i.instance === instanceName : true)[0]
    .value
}

function nominalTsValueToIntervalTsValue(elem, index, arr) {
  if (index === 0) return []

  let prev = arr[index - 1]

  return {
    ...elem, // copy everything over and replace the value
    value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
  }
}

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const { metricName, divisorMetricName } = config
  // find all the possible instance names for the primary metric
  const instanceNames = datasets
    .map(ds => ds.values).reduce(flatten, [])                     // traverse to values, flatten
    .filter(ds => ds.name === metricName)                         // filter for only relevant metrics
    .map(v => v.instances).reduce(flatten, [])                    // traverse to instances, flatten
    .map(i => i.instance)                                         // extract instance value
    .filter(uniqueFilter)                                         // extract unique

  if (instanceNames.length == 0) return null

  const data = instanceNames.map(iname => { return {
    title: `${metricName} (${iname})`,
    keylabel: iname,
    data: datasets
      .map(ds => ({
        ts: createTimestampFromDataset(ds),
        value: extractValueFromChartDataForInstance(ds, metricName, iname),
        divisor: extractValueFromChartData(ds, divisorMetricName) * 10 // TODO wtf why the extra 10 required here, i cannot work it out
      }))
      .map(nominalTsValueToIntervalTsValue)
      .slice(1) // remove the first element, since it is a dummy value
      .map(ds => ({ ts: ds.ts, value: ds.value / ds.divisor }))
  }})

  return data
}

function requiredMetricNames(config) {
  // we need any metrics for the chart plus the cpu count
  return [ config.metricName, config.divisorMetricName ]
}

export default {
  calculateChart,
  requiredMetricNames
}
