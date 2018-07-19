const flatten = (xs, ys) => xs.concat(ys)
const uniqueFilter = (val, index, array) => array.indexOf(val) === index

import { uniqWith, isEqual } from 'lodash'

function createTimestampFromDataset(dataset) {
  return new Date(dataset.timestamp.s * 1000 + dataset.timestamp.us / 1000)
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

function extractInstancesForMetric(datasets, metricNames) {
  // find all the possible instance names for the primary metric
  let instanceTags = datasets
    .map(ds => ds.values).reduce(flatten, [])                     // traverse to values, flatten
    .filter(ds => metricNames.includes(ds.name))                  // filter for only relevant metrics
    .map(ds => {
      let newInstances = ds.instances.map(i => Object.assign({ _metricName: ds.name }, i))
      return Object.assign({ _instances: newInstances }, ds)
    })                                                            // modify each instance, adding a _metricName
    .map(v => v._instances).reduce(flatten, [])                    // traverse to instances, flatten
    .map(i => ({ metric: i._metricName, instance: i.instance }))  // extract instance value
  return uniqWith(instanceTags, isEqual)
}

/**
 * Convert a nominal value to a interval value
 * ie: convert a series that increments forever into an average over the last time period
 */
function nominalTsValueToIntervalTsValue(elem, index, arr) {
  if (index === 0) return []

  let prev = arr[index - 1]

  return {
    ...elem, // copy everything over and replace the value with time scaled from previous
    value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
  }
}

export {
  flatten,
  uniqueFilter,
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractInstancesForMetric,
  nominalTsValueToIntervalTsValue,
}
