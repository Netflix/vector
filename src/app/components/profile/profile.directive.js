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

 /*global d3v4*/

(function () {
    'use strict';

    function profile($rootScope, $interval, $timeout, D3Service, ProfileService) {

        function poll_for_status(scope, status, cb) {
            if(!$rootScope.flags.contextAvailable) {
                return;
            }

            ProfileService.pollStatus().success(function(data) {
                if (angular.isUndefined(data.values[0])) {
                    return;
                }

                var pmda_value = angular.fromJson(data.values[0].instances[0].value);
                scope.status = pmda_value.status;
                scope.data = pmda_value.data;

                if (status && scope.status != status) {
                    $timeout(poll_for_status.bind(null, scope, status, cb), $rootScope.properties.interval * 1000);
                }
                else if (cb) {
                    cb();
                }
            }).error(function() {
                $timeout(poll_for_status.bind(null, scope, status, cb), $rootScope.properties.interval * 1000);
            });
        }

        function limit_max_stack_depth(node, depth, maxDepth) {
            if (depth >= maxDepth) {
                node.children = [];
                return;
            }
            for(var i = 0; i < node.children.length; i++) {
                limit_max_stack_depth(node.children[i], depth + 1, maxDepth);
            }
        }

        function show_flamegraph(scope, element, flamegraph) {
            if (!scope.data) {
                return;
            }

            limit_max_stack_depth(scope.data, 1, scope.maxstackdepth);
            flamegraph
                .width(element.width());
            d3v4.select('#' + scope.id + '-flamegraph')
                .datum(scope.data)
                .call(flamegraph);
        }

        function link(scope, element) {
            scope.id = D3Service.getId();
            scope.flags = $rootScope.flags;

            scope.status = '';
            scope.data = null;
            scope.duration_left = -1;

            var countdownInterval = null;
            var flamegraph = d3v4.flamegraph()
                .minFrameSize(5);

            scope.startProfiling = function(duration) {
                scope.duration_left = duration;
                ProfileService.startProfiling().success(function() {
                    scope.status = 'starting';

                    poll_for_status(scope, "started", function() {
                        if (duration != -1) {
                            countdownInterval = $interval(function() {
                                scope.duration_left--;
                                if (scope.duration_left <= 0) {
                                    scope.stopProfiling();
                                }
                            }, 1000);
                        }
                    });
                });
            }

            scope.stopProfiling = function() {
                if (countdownInterval) {
                    $interval.cancel(countdownInterval);
                    countdownInterval = null;
                }

                ProfileService.stopProfiling().success(function() {
                    scope.status = 'stopping';
                    poll_for_status(scope, "stopped", show_flamegraph.bind(null, scope, element, flamegraph));
                });
            }

            scope.$watch('flags.contextAvailable', function(newValue) {
                if (newValue) {
                    scope.flamegraph_link = $rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_fetch?names=bcc.proc.profile';
                    poll_for_status(scope, null, show_flamegraph.bind(null, scope, element, flamegraph));
                }
            });
        }

        return {
            restrict: 'A',
            templateUrl: 'app/components/profile/profile.html',
            scope: {
                maxstackdepth: '='
              },
            link: link
        };
    }

    function countdownFormat() {
        return function(input) {
            var min = Math.floor(input / 60);
            var sec = input % 60;
            return (min < 10 ? "0": "") + min + ":" + (sec < 10 ? "0": "") + sec;
        };
    }

    angular
        .module('profile')
        .directive('profile', profile)
        .filter('countdownFormat', countdownFormat);

})();
