import {
  extractValueFromChartDataForInstance,
  createTimestampFromDataset,
  extractInstanceNamesForMetric,
} from './utils'

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
    data: datasets.map(ds => {return {
      ts: createTimestampFromDataset(ds),
      value: extractValueFromChartDataForInstance(ds, metricName, iname)
    }}).filter(ds => ds.value !== null)
  }})

  return data
}

function requiredMetricNames(config) {
  return [ config.metricName ]
}

export default {
  calculateChart,
  requiredMetricNames
}
