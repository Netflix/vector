/**!
 *
 *  Copyright 2018 Andreas Gerstmayr.
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

    function table($rootScope, D3Service) {

        function link(scope) {
            scope.id = D3Service.getId();
            scope.flags = $rootScope.flags;

            var dataModel = scope.$parent.widget.dataModel;
            var metrics = dataModel.metrics;

            scope.tableHeader = metrics.map(function(metric) { return metric.label; });
            scope.tableCssClass = metrics.map(function(metric) { return metric.css_class || ''; });

            scope.$on('updateMetrics', function () {
                scope.tableRows = [];

                for (var i = 0; i < scope.data.length; i++) {
                    var instance = scope.data[i];
                    if (instance.values.length > 0) {
                        var lastValue = instance.values[instance.values.length - 1].y;
                        scope.tableRows.push(lastValue);
                    }
                }
            });
        }

        return {
            restrict: 'A',
            templateUrl: 'app/components/table/table.html',
            scope: {
                data: '='
            },
            link: link
        };
    }

    angular
        .module('table')
        .directive('table', table);

})();
