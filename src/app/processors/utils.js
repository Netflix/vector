const flatten = (xs, ys) => xs.concat(ys)
const uniqueFilter = (val, index, array) => array.indexOf(val) === index
const keyValueArrayToObject = (obj, { key, value }) => { obj[key] = value; return obj; }

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
  // note: performance sensitive

  // functional arrays and maps explodes the performance due to the nature of the nested loop explosion, so choose to collect
  // this in an associative set

  // collect all the metric instances
  let metricInstances = {}
  for (let d in datasets) {
    for (let v in datasets[d].values) {
      let metric = datasets[d].values[v].name
      if (metricNames.includes(metric)) {
        metricInstances[metric] = metricInstances[metric] || {}
        for (let i in datasets[d].values[v].instances) {
          let instance = datasets[d].values[v].instances[i].instance
          metricInstances[metric][instance] = instance
        }
      }
    }
  }

  // format them nicely for output
  let output = []
  for (let metric in metricInstances) {
    for (let instance in metricInstances[metric]) {
      // fetch the actual value, not the key, so we get the right type, since a key is always coerced to a string
      output.push({ metric, instance: metricInstances[metric][instance] })
    }
  }
  return output
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
      ...acc[existingIndex],
      data: newData
    }
    return newArray
  }
}

function findCgroupId (iname) {
  if (typeof iname !== 'string') return iname

  // plain docker: docker/<cgroup_id>
  if (iname.includes('/docker/')) {
    return iname.split('/')[2]
  }

  // systemd: /docker-cgroup_id.scope
  if (iname.includes('/docker-') && iname.includes('.scope')) {
    return iname.split('-')[1].split('.')[0]
  }

  // /container.slice/<cgroup_id> and /container.slice/???/<cgroup_id>
  if (iname.includes('/containers.slice/')) {
    const inameArr = iname.split('/')
    return inameArr[inameArr.length - 1]
  }

  // not found
  return null
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
    .filter(({ value }) => !!value)
}

/**
 * Note: this only keeps timestamps which are present in the first index
 */
function transposeToTimeslices(metricInstances) {
  if (!metricInstances) return metricInstances

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
        .reduce(keyValueArrayToObject, {})
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

function firstValueInObject(obj) {
  return obj[Object.keys(obj)[0]]
}

export {
  flatten,
  uniqueFilter,
  keyValueArrayToObject,
  createTimestampFromDataset,
  extractValueFromChartDataForInstance,
  extractInstancesForMetric,
  nominalTsValueToIntervalTsValue,
  combineValuesAtTimestampReducer,
  combineValuesByTitleReducer,
  findCgroupId,
  getAllMetricInstancesAtTs,
  transposeToTimeslices,
  untransposeTimeslices,
  applyFunctionsToTimeslices,
  firstValueInObject,
}
