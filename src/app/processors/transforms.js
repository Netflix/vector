import {
  untransposeTimeslices,
  applyFunctionsToTimeslices,
  combineValuesByTitleReducer,
  transposeToTimeslices
} from './utils'

/* helper to allow selecting all values */
const SELECT_ALL_FN = () => true

/**
 * Convert a nominal value to a interval value. Performs a derivative over time.
 *
 * ie: convert a series that increments forever into an average over the last time period
 *
 * @param {function} the function that decides whether a cumulative transform should be applied
 * @returns {function} a transform function
 */
function cumulativeTransformSelective (shouldApplyFn) {
  function nominalTsValueToIntervalTsValue(elem, index, arr) {
    if (index === 0) return []
    let prev = arr[index - 1]
    return {
      ...elem, // copy everything over and replace the value with time scaled from previous
      value: ((elem.value - prev.value) / ((elem.ts - prev.ts) / 1000))
    }
  }

  return function _cumulativeTransformSelective (metricInstances) {
    return metricInstances.map(mi => {
      return shouldApplyFn(mi)
        ? { ...mi, data: mi.data.map(nominalTsValueToIntervalTsValue).slice(1) }
        : mi
    })
  }
}

/**
 * Convert a nominal value to a interval value. Performs a derivative over time.
 *
 * ie: convert a series that increments forever into an average over the last time period
 *
 * @returns {function} a transform function
 */
export const cumulativeTransform = () => cumulativeTransformSelective(SELECT_ALL_FN)

/**
 * Convert a nominal value to a interval value. Performs a derivative over time.
 *
 * ie: convert a series that increments forever into an average over the last time period
 *
 * @param {metricNames} list of metric names to apply transform to
 * @returns {function} a transform function
 */
export function cumulativeTransformOnlyMetrics (metricNames) {
  return cumulativeTransformSelective(mi => metricNames.includes(mi.metric))
}

/**
 * Perform generic (typically linear) math on instantaneous values
 *
 * @param {function} math the function that will be executed on all values
 * @param {function} shouldApplyFn the function that decides whether the transform will apply
 * @return {function} a transform function
 */
export function mathValuesSelective (math, shouldApplyFn) {
  return function _mathSomeSelective (metricInstances) {
    return metricInstances.map(mi => {
      let result = shouldApplyFn(mi)
        ? { ...mi, data: mi.data.map(({ ts, value }) => ({ ts, value: math(value) })) }
        : mi
      return result
    })
  }
}

/**
 * Perform generic (typically linear) math on all instantaneous values in a dataset
 *
 * @param {function} math the function that will be executed on all values
 * @return {function} a transform function
 */
export const mathAllValues = (fn) => mathValuesSelective(fn, SELECT_ALL_FN)

/**
 * Perform a kb->gb conversion of all values (ie: divide by 1024^2)
 *
 * @return {function} a transform function
 */
export const kbToGb = () => mathAllValues(v => v / 1024 / 1024)

/**
 * Perform a division of all values by a constant
 *
 * @param {number} divisor the constant that will be the divisor
 * @return {function} a transform function
 */
export const divideBy = (divisor) => mathAllValues(v => v / divisor)

/**
 * Perform a Math.ceiling against all values
 *
 * @return {function} a transform function
 */
export const ceiling = () => mathAllValues(v => Math.ceil(v))

/**
 * Perform a division of values by a constant for the given metrics
 *
 * @param {number} divisor the constant that will be the divisor
 * @param {metricNames} array the list of metric names to transform
 * @return {function} a transform function
 */
export const divideByOnlyMetric = (divisor, metricNames) =>
  mathValuesSelective((v) => v / divisor, (i) => metricNames.includes(i.metric))

/**
 * Combine metrics sharing the same 'title', applying some function to combine them, for
 * example a sum function.
 *
 * @param {function} fn the combiner (eg a sum function) that will be used to reduce across values
 * @return {function} a transform function
 */
export function combineValuesByTitle (fn) {
  return function _combineValuesByTitle (metricInstances) {
    return metricInstances.reduce(combineValuesByTitleReducer(fn), [])
  }
}

/**
 * Divide all values (excluding seriesName) by the values in seriesName, assumes there is only one instance
 * for the divisor metric.
 *
 * @param {string} metricName the divisor metric name
 * @return {function} a transform function
 */
export function divideBySeries (divisorMetricName) {
  return function _divideBySeries (metricInstances) {
    const divisorSeries = metricInstances.find(mi => mi.metric === divisorMetricName).data
    const outputs = metricInstances.filter(mi => mi.metric !== divisorMetricName)
    let result = outputs.map(mi => {
      return {
        ...mi,
        data: mi.data.map(({ ts, value }) => {
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

/**
 * Adds a default title and keylabel to the metric instances
 *
 * @return {function} a transform function
 */
export function defaultTitleAndKeylabel () {
  return function _defaultTitleAndKeylabel (metricInstances) {
    return metricInstances.map(mi => {
      const defaultTitle = (mi.instance === -1 || mi.instance === '-1') ? mi.metric : `${mi.metric} (${mi.instance})`
      return { ...mi, title: defaultTitle, keylabel: defaultTitle }
    })
  }
}

/**
 * Adds a custom title and keylabel to the metric instances, where the title and keylabel is generated by a
 * user specified function
 *
 * @param {function} titleFn the fn that will be called to map the metric and instance names to a title
 * @return {function} a transform function
 */
export function customTitleAndKeylabel (titleFn) {
  return function _customTitleAndKeylabel (metricInstances) {
    return metricInstances.map(mi => {
      const newTitleAndKeylabel = titleFn(mi.metric, mi.instance)
      return {
        ...mi,
        title: newTitleAndKeylabel,
        keylabel: newTitleAndKeylabel,
      }
    })
  }
}

/**
 * Maps PCP instance domains to metric instances
 * Used to map pcp instance ids (such as 0, 1, 2, ...) to strings such as ('xvda', 'xvdb', etc)
 *
 * @param {string} the instance name to map as, 'instance' if not provided
 * @return {function} a transform function
 */
export function mapInstanceDomains (name) {
  let tagName = name || 'instance'
  return function _mapInstanceDomains (metricInstances, { instanceDomainMappings }) {
    return metricInstances.map(mi => ({
      ...mi,
      [tagName]: (instanceDomainMappings[mi.metric] && instanceDomainMappings[mi.metric][mi.instance]) || mi.instance
    }))
  }
}

/**
 * Maps container names to the container instance id
 *
 * @param {metricNames} array the list of metric names that will have the instance tag mapped to a container
 * @return {function} a transform function
 */
export function mapContainerNames (metricNames) {
  return function _mapContainerNames (metricInstances, { containerList }) {
    return metricInstances
      .map(mi => {
        if (! metricNames.includes(mi.metric)) return mi
        let container = containerList.find(e => e.cgroup === mi.instance) || {}
        return { ...mi, instance: container.containerId }
      })
      // make sure the instance had a valid name
      .filter(mi => !!mi.instance)
  }
}

/**
 * Logs data at this point in the pipeline (does not actually transform the data)
 *
 * @param {string} message the log message to add to the console output
 * @return {function} a transform function
 */
export function log (message) {
  return function _log (metricInstances) {
    console.log(message, metricInstances)
    return metricInstances
  }
}

/**
 * Completely transforms an input set of data at each timepoint
 * Assumes that a time sample exists at each point
 *
 * This is probably an expensive transform though so there may be cheaper ways to hardcode (tbc)
 *
 * Best to see some of the examples to see what is possible
 *
 * @param {object} an associative set specifying, for a given output at a given time series, what the fn to be applied should be
 * @return {function} a transform function
 */
export function timesliceCalculations (calcs) {
  return function _timesliceCalculations (metricInstances) {
    const slices = transposeToTimeslices(metricInstances)
    const calculated = applyFunctionsToTimeslices(slices, calcs)
    const untransposed = untransposeTimeslices(calculated)
    return untransposed
  }
}

/**
 * Renames one or more metric names
 *
 * @param {object} a rename mapping table
 * @return {function} a transform function
 */
export function renameMetric (renames) {
  return function _renameMetric (metricInstances) {
    return metricInstances.map(mi => ({
      ...mi,
      metric: (mi.metric in renames) ? renames[mi.metric] : mi.metric
    }))
  }
}

/**
 * Removes anything not matching the configured containerId
 *
 * Assumes the 'instance' tag refers to the container id, which it should do immediately after a mapContainerNames
 * if containerId is falsey, return existing instances
 *
 * @param {string} metricNames the metric names to check for valid container ids
 * @return {function} a transform function
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
 *
 * @param {array} metricInstances the list to filter
 * @param {object} chartInfo the chart info data from which the filter property will be fetched
 * @return {object} the input list with only values matching the filter accepted
 */
export function filterInstanceIncludesFilterText (metricInstances, { chartInfo }) {
  if (!chartInfo.filter) return metricInstances
  return metricInstances.filter(mi => mi.instance ? mi.instance.includes(chartInfo.filter) : true)
}

/**
 * Filter metric names so that only metrics in the referenced list will be passed through
 *
 * @param {string} the name of the key in which to find metric names to filter by (this will be read from chartInfo)
 *
 * @return {function} a transform function
 */
export function filterKeepSelectedMetrics (chartInfoKey) {
  return function _filterKeepSelectedMetrics (metricInstances, { chartInfo }) {
    const selectedMetrics = chartInfo[chartInfoKey] || []
    return metricInstances.filter(mi => selectedMetrics.includes(mi.metric))
  }
}

export function onlyLatestValues () {
  function extractLatest(acc, elem) {
    return (acc.ts.getTime() > elem.ts.getTime()) ? acc : elem
  }

  return function _onlyLatestValues (metricInstances) {
    return metricInstances.map(mi => ({
      ...mi,
      data: [ mi.data.reduce(extractLatest, mi.data[0]) ],
    }))
  }
}
