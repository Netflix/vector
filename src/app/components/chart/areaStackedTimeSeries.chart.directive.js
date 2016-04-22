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

        function link(scope) {
            scope.id = D3Service.getId();
            scope.flags = $rootScope.flags;
            scope.legend = true;

            var chart;

            nv.addGraph(function () {

              var yAxisTickFormat = D3Service.yAxisTickFormat(),
                  height = 250;

              chart = nv.models.stackedAreaChart().options({
                  duration: 0,
                  useInteractiveGuideline: true,
                  interactive: false,
                  showLegend: true,
                  showXAxis: true,
                  showYAxis: true,
                  showControls: false
              });

              chart.margin({'left': 35, 'right': 35});

              chart.height(height);

              if (scope.forcey) {
                  chart.yDomain([0, scope.forcey]);
              }

              chart.x(D3Service.xFunction());
              chart.y(D3Service.yFunction());

              chart.xAxis.tickFormat(D3Service.xAxisTickFormat());

              if (scope.percentage) {
                  yAxisTickFormat = D3Service.yAxisPercentageTickFormat();
                  chart.yAxis.tickFormat();
              } else if (scope.integer) {
                  yAxisTickFormat = D3Service.yAxisIntegerTickFormat();
                  chart.yAxis.tickFormat();
              }

              chart.yAxis.tickFormat(yAxisTickFormat);

              nv.utils.windowResize(chart.update);

              d3.select('#' + scope.id + ' svg')
                .datum(scope.data)
                .style('height', height + 'px')
                .transition().duration(0)
                .call(chart);

              return chart;
            });

            scope.$on('updateMetrics', function () {
                chart.update();
            });
        }

        return {
            restrict: 'A',
            templateUrl: 'app/components/chart/chart.html',
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
        .module('chart')
        .directive('areaStackedTimeSeries', areaStackedTimeSeries);
})();
