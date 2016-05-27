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

    function toastrConfig(toastrConfig) {
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 8000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;
    }

    function logProviderConfig($logProvider) {
        $logProvider.debugEnabled(true);
    }

    angular
        .module('vector')
        .constant('config', {
            'protocol': 'http', // PMWEBD protocol (http or https)
            'port': 44323,  // PMWEBD port
            'hostspec': 'localhost', // Default PMCD hostspec
            'interval': '2', // Default update interval in seconds
            'window': '2', // Default graph time window in minutes
            'enableCpuFlameGraph': false, // Enable CPU flame graph (requires extra PMDA)
            'enableContainerWidgets': true, // Enable container widgets
            'disableHostspecInput': false, // Disable hostspec input
            'disableContainerFilter': false, // Disable container id filter input
            'disableContainerSelect': false, // Disable container name drop down select
            'containerSelectOverride': true, // Overrides requireContainerFilter widget option
            'useCgroupId': false, // Use container cgroup id instead of container name
            'expandHostname': false, // Automatically expand hostname input when application opens
            'disableHostnameInputContainerSelect': false // Disable hostname and hostspec input when container is selected
        })
        .config(toastrConfig)
        .config(logProviderConfig);
})();
