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

     /**
     * @name FlameGraphService
     */
     function FlameGraphService($log, $rootScope, $http, toastr) {
        var svgname = "";

        /**
        * @name generate
        * @desc
        */
        function generate() {
            $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_fetch?names=generic.cpuflamegraph')
                .success(function (data) {
                    if (angular.isDefined(data.values[0])) {
                        var message = data.values[0].instances[0].value;
                        var fields = message.split(" ");
                        if (fields[0] == "REQUESTED") {
                            svgname = fields[1];
                            toastr.success('generic.cpuflamegraph requested.', 'Success');
                        } else {
                            toastr.success('generic.cpuflamegraph already in progress (' + message + '), please wait.', 'Success');
                        }
                    } else {
                        toastr.error('Failed requesting generic.cpuflamegraph.', 'Error');
                    }
                }).error(function () {
                    toastr.error('Failed requesting generic.cpuflamegraph.', 'Error');
                });
        }

        function getSvgName() {
            return svgname;
       }

        return {
            generate: generate,
            getSvgName: getSvgName
        };
    }

    angular
        .module('flamegraph')
        .factory('FlameGraphService', FlameGraphService);

 })();
