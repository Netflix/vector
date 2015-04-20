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

(function () {
    'use strict';

    function lineIntegerForceYTimeSeries($rootScope, D3Service) {

        function link(scope) {
            scope.yAxisTickFormat = D3Service.yAxisIntegerTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
            scope.height = 250;
            scope.flags = $rootScope.flags;
            scope.$on('widgetResized', function (event, size) {
                scope.width = size.width || scope.width;
                scope.height = size.height || scope.height;
                d3.select('#' + scope.id + ' svg').style({'height': scope.height});
            });
        }

        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'partials/line-integer-forcey-timeseries.html',
            scope: {
                data: '='
            },
            link: link
        };
    }

    angular
        .module('app.directives')
        .directive('lineIntegerForceYTimeSeries',
                   lineIntegerForceYTimeSeries);

})();
