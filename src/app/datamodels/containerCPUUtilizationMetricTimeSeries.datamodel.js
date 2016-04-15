/**!
 *
 */
 (function () {
     'use strict';

    /**
    * @name ContainerCPUUtilizationMetricTimeSeriesDataModel
    * @desc
    */
    function ContainerCPUUtilizationMetricTimeSeriesDataModel(ContainerMetadataService, WidgetDataModel, MetricListService, VectorService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);
            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            // create create base metrics
            var cpuUsageMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.cpuacct.usage'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    lastValue,
                    name;

                if ( cpuUsageMetric.data.length > 0){
                    angular.forEach(cpuUsageMetric.data, function (instance) {

                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            lastValue = instance.values[instance.values.length - 1];
                            name = ContainerMetadataService.idDictionary(instance.key) || instance.key;

                            if (ContainerMetadataService.checkContainerName(name) && ContainerMetadataService.checkGlobalFilter(name)) {
                                returnValues.push({
                                    timestamp: lastValue.x,
                                    key: name,
                                    value: lastValue.y / 1000 / 1000 / 1000
                                });
                            }
                        }

                        ContainerMetadataService.resolveId(instance.key);
                    });
                }

                return returnValues;
            };

            // create derived metric
            this.metric = MetricListService.getOrCreateDerivedMetric(this.name, derivedFunction);

            this.updateScope(this.metric.data);
        };

        DataModel.prototype.destroy = function () {
            // remove subscribers and delete derived metric
            MetricListService.destroyDerivedMetric(this.name);

            // remove subscribers and delete base metrics
            MetricListService.destroyMetric('cgroup.cpuacct.usage');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('app.datamodels')
        .factory('ContainerCPUUtilizationMetricTimeSeriesDataModel', ContainerCPUUtilizationMetricTimeSeriesDataModel);
 })();
