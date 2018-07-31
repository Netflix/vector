import { untransposeTimeslices, applyFunctionsToTimeslices, combineValuesByTitleReducer, transposeToTimeslices } from './utils'

const selectAll = () => true

function nominalTsValueToIntervalTsValue(elem, index, arr) {
  if (index === 0) return []
  let prev = arr[index - 1]
  return {
    ...elem, // copy everything over and replace the value with time scaled from previous
    value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
  }
}

/**
 * Convert a nominal value to a interval value
 * ie: convert a series that increments forever into an average over the last time period
 */
export function cumulativeTransformSelective (shouldApplyFn) {
  return function _cumulativeTransformSelective (instances) {
    return instances.map(instance => {
      return shouldApplyFn(instance)
        ? { ...instance, data: instance.data.map(nominalTsValueToIntervalTsValue).slice(1) }
        : instance
    })
  }
}
export const cumulativeTransform = cumulativeTransformSelective(selectAll)
export function cumulativeTransformOnlyMetric (metric) {
  return cumulativeTransformSelective(mi => mi.metric === metric)
}

/**
 * Perform generic (typically linear) math on instantaneous values
 */
export function mathValuesSelective (math, shouldApplyFn) {
  return function _mathSomeSelective (instances) {
    return instances.map(instance => {
      let result = shouldApplyFn(instance)
        ? { ...instance, data: instance.data.map(({ ts, value }) => ({ ts, value: math(value) })) }
        : instance
      return result
    })
  }
}

export const mathAllValues = (fn) => mathValuesSelective(fn, selectAll)
export const kbToGb = mathAllValues(v => v / 1024 / 1024)
export const divideBy = (number) => mathAllValues(v => v / number)
export const toPercentage = mathAllValues(v => v * 100)
export const divideByOnlyMetric = (number, metric) => mathValuesSelective((v) => v / number, (i) => i.metric === metric)

/**
 * Combine metrics sharing the same title, applying some function to combine them
 */
export function combineValuesByTitle (fn) {
  return function _combineValuesByTitle (instances) {
    return instances.reduce(combineValuesByTitleReducer(fn), [])
  }
}

/**
 * Divide all values (excluding seriesName) by the values in seriesName, assumes there is only one instance for the divisor metric
 * Return all series except the seriesName series
 */
export function divideBySeries (metricName) {
  return function _divideBySeries (instances) {
    const divisorSeries = instances.find(i => i.metric === metricName).data
    const outputs = instances.filter(i => i.metric !== metricName)
    let result = outputs.map(instance => {
      return {
        ...instance,
        data: instance.data.map(({ ts, value }) => {
          // look up ts in divisor array
          let divPoint = divisorSeries.find(divisor => ts.getTime() === divisor.ts.getTime())
          // return value divided by divisor value
          return { ts, value: value / divPoint.value }
        })
      }
    })
    return result
  }
}

export function defaultTitleAndKeylabel (instances) {
  return instances.map(instance => {
    const defaultTitle = (instance.instance === -1 || instance.instance === '-1') ? instance.metric : `${instance.metric} (${instance.instance})`
    return { ...instance, title: defaultTitle, keylabel: defaultTitle }
  })
}

export function customTitleAndKeylabel (titleFn) {
  return function _customTitleAndKeylabel (instances) {
    return instances.map(instance => {
      const newTitleAndKeylabel = titleFn(instance.metric, instance.instance)
      return {
        ...instance,
        title: newTitleAndKeylabel,
        keylabel: newTitleAndKeylabel,
      }
    })
  }
}

export function mapInstanceDomains (instances, { instanceDomainMappings }) {
  return instances.map(instance => ({
    ...instance,
    instance: (instanceDomainMappings[instance.metric] && instanceDomainMappings[instance.metric][instance.instance]) || instance.instance
  }))
}

export function mapContainerNames (metricName) {
  return function _mapContainerNames (metricInstances, { containerList }) {
    return metricInstances
      .map(metricInstance => {
        if (metricInstance.metric !== metricName) return metricInstance
        let container = containerList.find(e => e.cgroup === metricInstance.instance) || {}
        return { ...metricInstance, instance: container.containerId }
      })
      // make sure the instance had a valid name
      .filter(metricInstance => !!metricInstance.instance)
  }
}

export function log (message) {
  return function _log (instances) {
    console.log(message, instances)
    return instances
  }
}

export function filterOutPartialTimestamps (metricInstances) {
  // from each data element, capture the timestamp only
  const timestamps = metricInstances.map(mi =>
    mi.data.map(({ ts }) => ts.getTime())
  )

  // filter to only include elements in both
  const eligibleTimestamps = timestamps.reduce(
    (acc, array) => acc.filter(ts => array.includes(ts)),
    timestamps[0] || []) // start with a default set

  // filter the data content, so that only eligible timestamps are present
  const filteredInstances = metricInstances.map(mi => ({
    ...mi,
    data: mi.data.filter(tsv => eligibleTimestamps.includes(tsv.ts.getTime()))
  }))

  return filteredInstances
}

/**
 * Completely transforms an input set of data at each timepoint
 * Assumes that a time sample exists at each point
 *
 * This is probably an expensive transform though so there may be cheaper ways to hardcode (tbc)
 */
export function timesliceCalculations (calcs) {
  return function _timesliceCalculations (instances) {
    const slices = transposeToTimeslices(instances)
    const calculated = applyFunctionsToTimeslices(slices, calcs)
    const untransposed = untransposeTimeslices(calculated)
    // then untranspose from timeslice to instance view
    return untransposed
  }
}

export function renameMetric (renames) {
  return function _renameMetric (instances) {
    return instances.map(instance => ({
      ...instance,
      metric: (instance.metric in renames) ? renames[instance.metric] : instance.metric
    }))
  }
}

/**
 * Removes anything not matching the configured containerId
 *
 * Assumes the 'instance' tag refers to the container id, which it should do immediately after a mapContainerNames
 * if containerId is falsey, return existing instances
 */
export function filterForContainerId (metricNames) {
  return function _filterForContainerId (metricInstances, { containerId }) {
    if (!containerId) return metricInstances
    // only filter out where (it is not a filterable metric) or (it is a filterable metric and the container instance matches)
    return metricInstances.filter(mi => !metricNames.includes(mi.metric) || metricNames.includes(mi.metric) && containerId === mi.instance)
  }
}

/**
 * Filter instance name by settings (basic includes)
 */
export function filterInstanceIncludesFilterText (metricInstances, { settings }) {
  if (!settings.filter) return metricInstances
  return metricInstances.filter(mi => mi.instance ? mi.instance.includes(settings.filter) : true)
}
