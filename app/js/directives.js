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

/*jslint node: true*/
/*jslint todo: true */
/*global d3, angular*/

(function () {
    'use strict';

    /* Directives */

    

    

    

    

    

    

    

    

    angular
        .module('app.directives', [])
        .directive('lineTimeSeries', lineTimeSeries)
        .directive('lineIntegerTimeSeries',
                   lineIntegerTimeSeries)
        .directive('linePercentageTimeSeries',
                   linePercentageTimeSeries)
        .directive('linePercentageForceYTimeSeries',
                   linePercentageForceYTimeSeries)
        .directive('lineIntegerForceYTimeSeries',
                   lineIntegerForceYTimeSeries)
        .directive('areaStackedTimeSeries',
                   areaStackedTimeSeries)
        .directive('areaStackedIntegerTimeSeries',
                   areaStackedIntegerTimeSeries)
        .directive('areaStackedPercentageTimeSeries',
                   areaStackedPercentageTimeSeries)
        .directive('areaStackedPercentageForceYTimeSeries',
                   areaStackedPercentageForceYTimeSeries)
        .directive('ngDelay', ngDelay)
        .directive('cpuFlameGraph', cpuFlameGraph)
        .directive('diskLatencyHeatMap', diskLatencyHeatMap);

})();
