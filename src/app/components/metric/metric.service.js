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
    * @name MetricService
    * @desc Provides Instances names
    */
    function MetricService($http, $rootScope, PMAPIService) {
        return {
            getInames: function (metric, iid) {
                return PMAPIService.getInstanceDomainsByName($rootScope.properties.context, metric, [iid]);
            }
        };
    }

    angular
      .module('metric')
      .factory('MetricService', MetricService);
})();
