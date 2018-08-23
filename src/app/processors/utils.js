import {
  flatten,
  keyValueArrayToObjectReducer,
} from '../utils'

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
      ...acc[existingIndex],
      data: newData
    }
    return newArray
  }
}

function getAllMetricInstancesAtTs(metricInstances, ts) {
  return metricInstances
    .map(({ metric, instance, data }) => {
      const tsv = data.find(tsv => tsv.ts.getTime() === ts.getTime())
      return {
        metric: metric,
        instance: instance,
        value: tsv && tsv.value,
      }
    })
    .filter(({ value }) => value !== null && typeof value !== 'undefined')
}

/**
 * Note: this only keeps timestamps which are present in the first index
 */
function transposeToTimeslices(metricInstances) {
  if (!metricInstances || metricInstances.length === 0) return metricInstances

  const timestamps = metricInstances[0].data.map(tsv => tsv.ts)
  return timestamps.map(ts => {
    const values = getAllMetricInstancesAtTs(metricInstances, ts)
    // transform to a hierarchy of associative objects rather than an array of tuples
    const transformed = values.reduce((acc, { metric, instance, value }) => {
      acc[metric] = acc[metric] || {}
      acc[metric][instance] = value
      return acc
    }, {})
    return { ts, values: transformed }
  })
}

function applyFunctionsToTimeslices(timeslices, fns) {
  return timeslices.map(({ ts, values }) => {
    return {
      ts,
      values: Object.keys(fns)
        // apply the function to all the values
        .map(fname => {
          let valuesOut
          try {
            valuesOut = fns[fname](values)
          } catch (err) {
            console.warn('could not apply fn', err.message)
          }
          return { key: fname, value: valuesOut }
        })
        .reduce(keyValueArrayToObjectReducer, {})
    }
  })
}

function getMetricInstancesFromTimeslice(slice) {
  return Object.keys(slice.values).map(metric => {
    if (!slice.values[metric]) return []
    const instancesForThisMetric = Object.keys(slice.values[metric])
    return instancesForThisMetric.map(instance => ({ metric, instance }))
  }).reduce(flatten, [])
}


function untransposeTimeslices(timeslices) {
  if (!timeslices.length) return timeslices

  const metricInstances = timeslices
    .map(t => getMetricInstancesFromTimeslice(t))
    .reduce(flatten)
    .filter((val, index, arr) => arr.findIndex(e => e.metric === val.metric && e.instance === val.instance) === index)

  const untransposed = metricInstances.map(({ metric, instance}) => ({
    metric,
    instance,
    data: timeslices.map(({ ts, values }) => ({ ts, value: values && values[metric] && values[metric][instance] })).filter(tsv => !!tsv.value)
  }))
  return untransposed
}

export {
  combineValuesAtTimestampReducer,
  combineValuesByTitleReducer,
  getAllMetricInstancesAtTs,
  transposeToTimeslices,
  untransposeTimeslices,
  applyFunctionsToTimeslices,
}
