import { flatten, uniqueFilter, createTimestampFromDataset } from './utils'

function extractValueFromChartData(dataset, metricName, instanceName) {
  // given a single pmweb fetch result, traverse the metricName -> instances -> value hierarchy to get a specific value
  return dataset.values
    .filter(v => v.name === metricName).reduce(flatten)
    .instances
    .filter(i => i.instance === instanceName)[0]
    .value
}

/**
 * Extracts a single metric by name from the datasets
 */
function calculateChart(datasets, config) {
  const metricName = config.metricName
  // find all the possible instance names
  const instanceNames = datasets
    .map(ds => ds.values).reduce(flatten, [])                     // traverse to values, flatten
    .filter(ds => ds.name === metricName)                         // filter for only relevant metrics
    .map(v => v.instances).reduce(flatten, [])                    // traverse to instances, flatten
    .map(i => i.instance)                                         // extract instance value
    .filter(uniqueFilter)                                         // extract unique

  if (instanceNames.length == 0) return null

  // create an entry for each instance name
  const data = instanceNames.map(iname => { return {
    title: `${metricName} (${iname})`,
    keylabel: iname,
    data: datasets.map(ds => {return {
      ts: createTimestampFromDataset(ds),
      value: extractValueFromChartData(ds, metricName, iname)
    }})
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
