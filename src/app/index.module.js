/**!
 *
 *  Copyright 2015 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

require('./vendors')

require('bootstrap/dist/css/bootstrap.css')
require('font-awesome/scss/font-awesome.scss')
require('./_reboot.min.css')
require('./index.css')

require('./main/main.controller')


angular.module('vector', [
    'ngRoute',
    'ui.dashboard',
    'main',
    'toastr'
  ]);

require('./index.route')
require('./index.config')
require('./index.constants')
require('./index.decorators')
require('./index.extensions')
require('./index.filters')
require('./index.version')

require('./components/datamodel/datamodel.module')

require('./components/containermetadata/containermetadata.service')
require('./components/cswflamegraphtask/cswflamegraph.module')
require('./components/cswflamegraphtask/cswflamegraph.service')
require('./components/cswflamegraphtask/cswflamegraph.directive')
require('./components/d3/d3.service')
require('./components/dashboard/dashboard.service')
require('./components/diskioflamegraphtask/diskioflamegraph.module')
require('./components/diskioflamegraphtask/diskioflamegraph.service')
require('./components/diskioflamegraphtask/diskioflamegraph.directive')
require('./components/flamegraph/flamegraph.module')
require('./components/flamegraph/flamegraph.service')
require('./components/flamegraph/flamegraph.directive')
require('./components/heatmap/heatmap.module')
require('./components/heatmap/heatmap.service')
require('./components/heatmap/heatmap.directive')
require('./components/ipcflamegraphtask/ipcflamegraph.module')
require('./components/ipcflamegraphtask/ipcflamegraph.service')
require('./components/ipcflamegraphtask/ipcflamegraph.directive')
require('./components/metriclist/metriclist.service')
require('./components/metric/metric.model')
require('./components/metric/metric.service')
require('./components/metric/converted.metric.factory')
require('./components/metric/cumulativeConverted.metric.factory')
require('./components/metric/cumulative.metric.factory')
require('./components/metric/derived.metric.factory')
require('./components/metric/simple.metric.factory')
require('./components/modal/modal.service')
require('./components/offcpuflamegraphtask/offcpuflamegraph.module')
require('./components/offcpuflamegraphtask/offcpuflamegraph.service')
require('./components/offcpuflamegraphtask/offcpuflamegraph.directive')
require('./components/offwakeflamegraphtask/offwakeflamegraph.module')
require('./components/offwakeflamegraphtask/offwakeflamegraph.service')
require('./components/offwakeflamegraphtask/offwakeflamegraph.directive')
require('./components/pagefaultflamegraphtask/pagefaultflamegraph.module')
require('./components/pagefaultflamegraphtask/pagefaultflamegraph.service')
require('./components/pagefaultflamegraphtask/pagefaultflamegraph.directive')
require('./components/pmapi/pmapi.service')
require('./components/pnamecpuflamegraphtask/pnamecpuflamegraph.module')
require('./components/pnamecpuflamegraphtask/pnamecpuflamegraph.service')
require('./components/pnamecpuflamegraphtask/pnamecpuflamegraph.directive')
require('./components/uninlinedcpuflamegraphtask/uninlinedcpuflamegraph.module')
require('./components/uninlinedcpuflamegraphtask/uninlinedcpuflamegraph.service')
require('./components/uninlinedcpuflamegraphtask/uninlinedcpuflamegraph.directive')
require('./components/unit/unit.service')
require('./components/widget/widget.factory')

require('./components/datamodel/containerMultipleMetric.datamodel.factory')
require('./components/datamodel/cgroupCPUUsageMetric.datamodel.factory')
require('./components/datamodel/containerMemoryUsageMetric.datamodel.factory')
require('./components/datamodel/bccBiolatencyMetric.datamodel.factory')
require('./components/datamodel/cumulativeMetric.datamodel.factory')
require('./components/datamodel/simpleMetric.datamodel.factory')
require('./components/datamodel/cgroupMemoryUsageMetric.datamodel.factory')
require('./components/datamodel/diskLatencyMetric.datamodel.factory')
require('./components/datamodel/cpuUtilizationMetric.datamodel.factory')
require('./components/datamodel/perCpuUtilizationMetric.datamodel.factory')
require('./components/datamodel/multipleCumulativeMetric.datamodel.factory')
require('./components/datamodel/networkBytesMetric.datamodel.factory')
require('./components/datamodel/cgroupCPUHeadroomMetric.datamodel.factory')
require('./components/datamodel/cgroupMemoryUtilizationMetric.datamodel.factory')
require('./components/datamodel/convertedMetric.datamodel.factory')
require('./components/datamodel/multipleMetric.datamodel.factory')
require('./components/datamodel/cumulativeUtilizationMetric.datamodel.factory')
require('./components/datamodel/bccRunqlatMetric.datamodel.factory')
require('./components/datamodel/dummyMetric.datamodel.factory')
require('./components/datamodel/containerNetworkBytesMetric.datamodel.factory')
require('./components/datamodel/containerMultipleCumulativeMetric.datamodel.factory')
require('./components/datamodel/memoryUtilizationMetric.datamodel.factory')
require('./components/datamodel/cgroupMemoryHeadroomMetric.datamodel.factory')
require('./components/datamodel/customMetric.datamodel.factory')

require('./components/chart/chart.module')
require('./components/chart/lineTimeSeries.chart.directive')
require('./components/chart/areaStackedTimeSeries.chart.directive')
require('./components/chart/nvd3-tooltip')

require('./components/customWidgetSettings/customWidgetSettings.controller')
require('./components/customWidgetHelp/customWidgetHelp.controller')
require('./components/widgetFilterSettings/widgetFilterSettings.controller')
