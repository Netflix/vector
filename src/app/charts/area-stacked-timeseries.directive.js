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

 /*global d3, nv*/

(function () {
    'use strict';

    function areaStackedTimeSeries($rootScope, $log, D3Service) {

        function link(scope, element, attrs) {
            scope.id = D3Service.getId();
            scope.height = 250;
            scope.flags = $rootScope.flags;
            scope.legend = true;

            var chart = nv.models.stackedAreaChart().options({
                transitionDuration: 0,
                useInteractiveGuideline: true,
                interactive: false,
                showLegend: true,
                showXAxis: true,
                showYAxis: true,
                showControls: false
            });

            chart.margin({'left': 35, 'right': 35});

            chart.height(scope.height);

            chart.noData('There is no data to display');

            if (scope.forcey) {
                chart.yDomain([0, scope.forcey]);
            }

            chart.x(D3Service.xFunction());
            chart.y(D3Service.yFunction());

            chart.xAxis.tickFormat(D3Service.xAxisTickFormat());

            if (scope.percentage) {
                chart.yAxis.tickFormat(D3Service.yAxisPercentageTickFormat());
            } else if (scope.integer) {
                chart.yAxis.tickFormat(D3Service.yAxisIntegerTickFormat());
            } else {
                chart.yAxis.tickFormat(D3Service.yAxisTickFormat());
            }

            function loadGraph() {
                d3.select('#' + scope.id + ' svg')
                  .datum(scope.data)
                  .style({'height': scope.height})
                  .transition().duration(0)
                  .call(chart);

                nv.utils.windowResize(chart.update);
            }

            nv.addGraph(chart);

            loadGraph();

            scope.$on('widgetResized', function (event, size) {
                scope.width = size.width || scope.width;
                scope.height = size.height || scope.height;
                d3.select('#' + scope.id + ' svg').style({'height': scope.height});
            });

            scope.$on('updateMetrics', function () {
                loadGraph();
            });

            scope.$on('hideLegend', function (event, widget) {
                $log.info(widget);
                $log.info(scope);
            });
        }

        return {
            restrict: 'A',
            templateUrl: 'app/charts/nvd3-chart.html',
            scope: {
                data: '=',
                percentage: '=',
                integer: '=',
                forcey: '='
            },
            link: link
        };
    }

    areaStackedTimeSeries.$inject = [
        '$rootScope',
        '$log',
        'D3Service'
    ];

    angular
        .module('app.charts')
        .directive('areaStackedTimeSeries', areaStackedTimeSeries);
})();
