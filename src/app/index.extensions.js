/**!
 *
 *  Copyright 2016 Netflix, Inc.
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

    // Container Name Resolver
    // Return resolved name as a strng to be used in chart and container selection
    // Return null to exclude the container from charts and container selection.

    // var containerNameResolver = function() {
    //     var resolve = function (containerId) {
    //       return containerId.substring(0,12);
    //     };
    //
    //     return {
    //       resolve: resolve
    //     };
    // };

    angular
        .module('vector')
        // .factory('containerNameResolver', containerNameResolver)
        ;
})();
