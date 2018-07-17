const flatten = (xs, ys) => xs.concat(ys)
const uniqueFilter = (val, index, array) => array.indexOf(val) === index

function createTimestampFromDataset(dataset) {
  return new Date(dataset.timestamp.s * 1000 + dataset.timestamp.us / 1000)
}

function extractValueFromChartDataAnyInstance(dataset, metricName) {
  // given a single pmweb fetch result, traverse the metricName -> instances -> value hierarchy to get a specific value
  return extractValueFromChartDataForInstance(dataset, metricName)
}

function extractValueFromChartDataForInstance(dataset, metricName, instanceName) {
  // given a single pmweb fetch result, traverse the metricName -> instances -> value hierarchy to get a specific value
  const valuesForMetric = dataset.values.filter(v => v.name === metricName).reduce(flatten, [])
  if (!valuesForMetric || valuesForMetric.length === 0) return null

  // filter by instances only if an instancename was provided
  const metrics = valuesForMetric[0].instances.filter(i => instanceName ? i.instance === instanceName : true)
  if (!metrics || metrics.length === 0) return null

  return metrics[0].value
}

function extractInstanceNamesForMetric(datasets, metricName) {
  // find all the possible instance names for the primary metric
  return datasets
    .map(ds => ds.values).reduce(flatten, [])                     // traverse to values, flatten
    .filter(ds => ds.name === metricName)                         // filter for only relevant metrics
    .map(v => v.instances).reduce(flatten, [])                    // traverse to instances, flatten
    .map(i => i.instance)                                         // extract instance value
    .filter(uniqueFilter)                                         // extract unique
}

export {
  flatten,
  uniqueFilter,
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractValueFromChartDataAnyInstance,
  extractInstanceNamesForMetric,
}
