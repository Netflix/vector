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

  /**
   * @name ProfileService
   */
  function ProfileService($log, $rootScope, $http, toastr) {

    function startProfiling() {
      return $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_store?name=bcc.proc.profile&value=start')
        .success(function () {
          toastr.success('Starting profiling...', 'Success');
        }).error(function (err) {
          toastr.error('Failed to start profiling: ' + err, 'Error');
        });
    }

    function stopProfiling() {
      return $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_store?name=bcc.proc.profile&value=stop')
        .success(function () {
          toastr.success('Stopping profiling...', 'Success');
        }).error(function (err) {
          toastr.error('Failed to stop profiling: ' + err, 'Error');
        });
    }

    function pollStatus() {
      return $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_fetch?names=bcc.proc.profile')
        .error(function (err) {
          toastr.error(err, 'Error');
        });
    }

    return {
      startProfiling: startProfiling,
      stopProfiling: stopProfiling,
      pollStatus: pollStatus
    };
  }

  angular
    .module('profile')
    .factory('ProfileService', ProfileService);

})();
