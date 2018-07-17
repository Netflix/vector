import {
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractInstanceNamesForMetric,
} from './utils'

function nominalTsValueToIntervalTsValue(elem, index, arr) {
  if (index === 0) return []

  let prev = arr[index - 1]
  return {
    ts: elem.ts,
    value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
  }
}

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const metricName = config.metricName
  const instanceNames = extractInstanceNamesForMetric(datasets, metricName)

  if (instanceNames.length == 0) return null

  // create an entry for each instance name
  const data = instanceNames.map(iname => { return {
    title: `${metricName} (${iname})`,
    keylabel: iname,
    data: datasets
      .map(ds => {return {
        ts: createTimestampFromDataset(ds),
        value: extractValueFromChartDataForInstance(ds, metricName, iname)
      }})
      .filter(ds => ds.value !== null)
      .map(nominalTsValueToIntervalTsValue)
      .slice(1) // remove the first element, since it is a dummy value
  }})

  return data
}

function requiredMetricNames(config) {
  // we need any metrics for the chart plus the cpu count
  return [ config.metricName ]
}

export default {
  calculateChart,
  requiredMetricNames
}
