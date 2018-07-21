const flatten = (xs, ys) => xs.concat(ys)
const uniqueFilter = (val, index, array) => array.indexOf(val) === index

import { uniqWith } from 'lodash'

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
  const instanceTags = datasets
    .map(ds => ds.values).reduce(flatten, [])                     // traverse to values, flatten
    .filter(ds => metricNames.includes(ds.name))                  // filter for only relevant metrics
    .map(ds => {
      let newInstances = ds.instances.map(i => Object.assign({ _metricName: ds.name }, i))
      return Object.assign({ _instances: newInstances }, ds)
    })                                                            // modify each instance, adding a _metricName
    .map(v => v._instances).reduce(flatten, [])                    // traverse to instances, flatten
    .map(i => ({ metric: i._metricName, instance: i.instance }))  // extract instance value
  return uniqWith(instanceTags, (a, b) => (a.metric === b.metric && a.instance === b.instance))
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

/**
 * Given an array of { ts, value } tuples, combine them so that there is only
 * one ts value, using combine function
 */
function combineValuesAtTimestampReducer(combiner) {
  return (acc, dp) => {
    const existingIndex = acc.findIndex(e => e.ts.getTime() === dp.ts.getTime())
    // not found in array
    if (existingIndex === -1) {
      return acc.concat(dp)
    }

    // found in array, clone the array but replace the element
    const newArray = acc.slice()
    newArray[existingIndex] = {
      ts: acc[existingIndex].ts,
      value: combiner(acc[existingIndex].value, dp.value),
    }
    return newArray
  }
}

/**
 * Given an array of [ { title, keylabel, data: { ts, value } } ],
 * and having duplicated title lines, combine each of the datapoints,
 * applying combiner to the data values such that there will only be unique 'title' lines
 */
function combineValuesByTitleReducer(combiner) {
  return (acc, ds) => {
    const existingIndex = acc.findIndex(e => e.title === ds.title)
    // not found
    if (existingIndex === -1) {
      return acc.concat(ds)
    }

    // found in array, clone array but replace dataset
    const newArray = acc.slice()
    const newData = [].concat(acc[existingIndex].data, ds.data)
      .reduce(combineValuesAtTimestampReducer(combiner), [])

    newArray[existingIndex] = {
      title: acc[existingIndex].title,
      keylabel: acc[existingIndex].keylabel,
      data: newData
    }
    return newArray
  }
}

export {
  flatten,
  uniqueFilter,
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractInstancesForMetric,
  nominalTsValueToIntervalTsValue,
  combineValuesAtTimestampReducer,
  combineValuesByTitleReducer,
}
