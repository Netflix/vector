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
     * @name HeatMapService
     * @desc
     */
     function HeatMapService($log, $rootScope, $http, flash) {

        /**
        * @name generate
        * @desc
        */
        function generate() {
                $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_fetch?names=generic.heatmap')
                    .success(function () {
                        flash.to('alert-disklatency-success').success = 'generic.heatmap requested!';
                        $log.info('generic.heatmap requested');
                    }).error(function () {
                        flash.to('alert-disklatency-error').error = 'failed requesting generic.heatmap!';
                        $log.error('failed requesting generic.heatmap');
                    });
        }

        ////////

        return {
            generate: generate
        };
    }

     angular
        .module('app.services')
        .factory('HeatMapService', HeatMapService);

 })();
