var config = angular.module('vector.config', []);

config.constant('vectorConfig', {
  'port': 7402,
  'interval': 2,
  'window': 2,
  'enableCpuFlameGraph': false,
  'enableDiskLatencyHeatMap': false
});
