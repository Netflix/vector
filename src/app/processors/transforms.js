import { untransposeTimeslices, applyFunctionsToTimeslices, combineValuesByTitleReducer, findContainerName, transposeToTimeslices } from './utils'

/**
 * Convert a nominal value to a interval value
 * ie: convert a series that increments forever into an average over the last time period
 */
export function cumulativeTransform (instances) {
  function nominalTsValueToIntervalTsValue(elem, index, arr) {
    if (index === 0) return []
    let prev = arr[index - 1]
    return {
      ...elem, // copy everything over and replace the value with time scaled from previous
      value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
    }
  }

  return instances.map(instance => ({
    ...instance,
    data: instance.data.map(nominalTsValueToIntervalTsValue).slice(1)
  }))
}

export const kbToGb = mathAllValues(v => v / 1024 / 1024)
export const divideBy = (number) => mathAllValues(v => v / number)
export const toPercentage = mathAllValues(v => v * 100)
export const divideByOnlyMetric = (number, metric) => mathSomeValues(v => v / number, i => i.metric === metric)

export function mathAllValues (math) {
  return function _mathAllValues (instances) {
    return instances.map(instance => ({
      ...instance,
      data: instance.data.map(({ ts, value }) => ({ ts, value: math(value) }))
    }))
  }
}

export function mathSomeValues (math, shouldApplyFn) {
  return function _mathSomeValues (instances) {
    return instances.map(instance =>
      shouldApplyFn(instance)
        ? { ...instance, data: instance.data.map(({ ts, value }) => ({ ts, value: math(value) })) }
        : instance
    )
  }
}

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

export function mapInstanceDomains (instances, instanceDomainMappings) {
  return instances.map(instance => ({
    ...instance,
    instance: (instanceDomainMappings[instance.metric] && instanceDomainMappings[instance.metric][instance.instance]) || instance.instance
  }))
}

export function fixContainerNames (metricInstances) {
  return metricInstances
    // map the names
    .map(metricInstance => ({
      ...metricInstance,
      instance: findContainerName(metricInstance.instance)
    }))
    // make sure the instance had a valid name
    .filter(metricInstance => !!metricInstance.instance)
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
