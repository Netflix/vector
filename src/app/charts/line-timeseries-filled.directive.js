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

    function lineTimeSeriesFilled($rootScope, $log, D3Service) {

        function link(scope) {
            scope.id = D3Service.getId();
            scope.flags = $rootScope.flags;

            var chart;

            nv.addGraph(function () {

              var height = 250;

              chart = nv.models.lineChart().options({
                  duration: 0,
                  useInteractiveGuideline: true,
                  interactive: false,
                  showLegend: true,
                  showXAxis: true,
                  showYAxis: true
              });

              chart.margin({'left': 45, 'right': 35});

              chart.height(height);

              chart.forceY([0]);

              chart.x(D3Service.xFunction());

              if (scope.percentage) {
                  chart.yAxis.tickFormat(D3Service.yAxisPercentageTickFormat());
              } else if (scope.integer) {
                  chart.yAxis.tickFormat(D3Service.yAxisIntegerTickFormat());
              } else {
                  chart.yAxis.tickFormat(D3Service.yAxisTickFormat());
              }

              d3.select('#' + scope.id + ' svg')
                .datum(scope.data)
                .style('height', height + 'px')
                .transition().duration(0)
                .call(chart);

              return chart;
            });

            scope.$on('updateMetrics', function () {
                angular.forEach(scope.data, function (instance) {
                  instance.area=true;
                });
                chart.update();
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

    lineTimeSeriesFilled.$inject = [
        '$rootScope',
        '$log',
        'D3Service'
    ];

    angular
        .module('app.charts')
        .directive('lineTimeSeriesFilled', lineTimeSeriesFilled);

})();
