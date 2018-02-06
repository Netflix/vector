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

    function cpuFlameGraph($rootScope, $timeout, FlameGraphService, DashboardService) {

        function link(scope) {
            scope.protocol = $rootScope.properties.protocol;
            scope.host = $rootScope.properties.host;
            scope.port = $rootScope.properties.port;
            scope.context = $rootScope.properties.context;
            scope.ready = false;
            scope.processing = false;
            scope.id = DashboardService.getGuid();
            scope.svgname = "error.svg";
            scope.statusmsg = "";
            scope.waited = 0;
            scope.pollms = 2000;
            scope.waitedmax = 10 * 60 * 1000;   // max poll milliseconds
            scope.secondoptions = ["5", "30", "60", "120"];
            scope.secondselected = "60";
            scope.widget.help_url = "app/components/flamegraph/flamegraph-help.html";

            scope.pollStatus = function() {
                FlameGraphService.pollStatus(function(statusmsg) {
                    scope.statusmsg = statusmsg;
                    scope.waited += scope.pollms;
                    var fields = statusmsg.split(" ");
                    if (fields[0] == "DONE" || fields[0] == "ERROR" || scope.waited > scope.waitedmax) {
                        if (scope.waited > scope.waitedmax)
                            scope.statusmsg = "Error, timed out";
                        if (fields[0] == "DONE") {
                            scope.statusmsg = "DONE";
                            scope.svgname = fields[1];
                            scope.processing = false;
                        }
                        if (fields[0] == "ERROR") {
                            scope.ready = false;
                            scope.processing = false;
                        }
                    } else {
                        $timeout(function () { scope.pollStatus(); }, scope.pollms);
                    }
                });
            };

            scope.generateFlameGraph = function() {
                FlameGraphService.generate(scope.secondselected, function(statusmsg) {
                    var fields = statusmsg.split(" ");
                    if (fields[0] == "ERROR") {
                        scope.statusmsg = statusmsg;
                        scope.ready = false;
                        scope.processing = false;
                        // don't launch poll
                    } else {
                        scope.statusmsg = statusmsg;
                        scope.ready = true;
                        scope.processing = true;
                        scope.waited = 0;
                        $timeout(function () { scope.pollStatus(); }, scope.pollms);
                    }
                });
            };
        }

        return {
            restrict: 'A',
            templateUrl: 'app/components/flamegraph/flamegraph.html',
            link: link
        };
    }

    angular
        .module('flamegraph')
        .directive('cpuFlameGraph', cpuFlameGraph);

})();
