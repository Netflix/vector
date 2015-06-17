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

    function lineIntegerTimeSeries($rootScope, D3Service) {

        function link(scope) {
            nv.addGraph(function() {
                scope.chart = nv.models.lineChart().options({
                    transitionDuration: 0,
                    useInteractiveGuideline: true,
                    interactive: false,
                    showLegend: true,
                    showXAxis: true,
                    showYAxis: true,
                });

                scope.chart.margin({'left': 50,'right': 50});

                scope.chart.height(scope.height);

                scope.chart.noData('There is no data to display');

                scope.chart.x(D3Service.xFunction());
                scope.chart.y(D3Service.yFunction());

                scope.chart.xAxis.tickFormat(D3Service.xAxisTickFormat());
                scope.chart.yAxis.tickFormat(D3Service.yAxisIntegerTickFormat());

                d3.select('#' + scope.id + ' svg')
                  .datum(scope.data)
                  .style({'height': scope.height})
                  .transition().duration(0)
                  .call(scope.chart);

                nv.utils.windowResize(scope.chart.update);

                return scope.chart;
            });

            scope.id = D3Service.getId();
            scope.height = 250;
            scope.flags = $rootScope.flags;
            scope.$on('widgetResized', function (event, size) {
                scope.width = size.width || scope.width;
                scope.height = size.height || scope.height;
                d3.select('#' + scope.id + ' svg').style({'height': scope.height});
            });

            scope.$on('updateMetrics', function () {
                scope.chart.update();
            });
        }

        return {
            restrict: 'A',
            templateUrl: 'app/charts/nvd3-chart.html',
            scope: {
                data: '='
            },
            link: link
        };
    }

    angular
        .module('app.directives')
        .directive('lineIntegerTimeSeries', lineIntegerTimeSeries);
})();
