/**
 * Provides a dummy model that produces no data
 */
function calculateChart() {
  return [ 'empty' ]
}

function requiredMetricNames() {
  return []
}

export default {
  calculateChart,
  requiredMetricNames
}
