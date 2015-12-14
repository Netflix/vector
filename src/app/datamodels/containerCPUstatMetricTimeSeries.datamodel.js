/**!
 *
 */
 (function () {
     'use strict';

    /**
    * @name ContainerCPUstatMetricTimeSeriesDataModel
    * @desc
    */
    function ContainerCPUstatMetricTimeSeriesDataModel(ContainerMetadataService, WidgetDataModel, MetricListService, VectorService) {
        var DataModel = function () {
            return this;
        };

        DataModel.prototype = Object.create(WidgetDataModel.prototype);

        DataModel.prototype.init = function () {
            WidgetDataModel.prototype.init.call(this);
            this.name = this.dataModelOptions ? this.dataModelOptions.name : 'metric_' + VectorService.getGuid();

            // create create base metrics
            var cpuSysMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.cpuacct.stat.user'),
                cpuUserMetric = MetricListService.getOrCreateCumulativeMetric('cgroup.cpuacct.stat.system'),
                derivedFunction;

            derivedFunction = function () {
                var returnValues = [],
                    lastValue2 = [];

                if ( cpuSysMetric.data.length > 0 && cpuUserMetric.data.length > 0){
                    angular.forEach(cpuSysMetric.data, function (instance) {
                        ContainerMetadataService.setCurrentTime(instance.previousTimestamp);
                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            lastValue2.push(instance.previousValue);
                            ContainerMetadataService.resolveId(instance.key);
                        }
                    });

                    angular.forEach(cpuUserMetric.data, function (instance) {

                        if (instance.values.length > 0 && ContainerMetadataService.containerIdExist(instance.key)) {
                            var lastValue = instance.values[instance.values.length - 1];
                            var name = ContainerMetadataService.idDictionary(instance.key) || instance.key;
                            //showing sum only, not individual values.
                            if (ContainerMetadataService.checkGlobalFilter(name)){
                                returnValues.push({
                                    timestamp: lastValue.x,
                                    key: name,
                                    value: instance.previousValue / lastValue2.shift() / 100
                                });
                            }
                            
                        }
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
            MetricListService.destroyMetric('cgroup.cpuacct.stat.user');
            MetricListService.destroyMetric('cgroup.cpuacct.stat.system');

            WidgetDataModel.prototype.destroy.call(this);
        };

        return DataModel;
    }

    angular
        .module('app.datamodels')
        .factory('ContainerCPUstatMetricTimeSeriesDataModel', ContainerCPUstatMetricTimeSeriesDataModel);
 })();
