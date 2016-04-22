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

 /*global d3*/

 (function () {
     'use strict';

    /**
    * @name D3Service
    * @desc
    */
    function D3Service() {

        function xAxisTickFormat() {
            return function (d) {
                return d3.time.format('%X')(new Date(d));
            };
        }

        function yAxisTickFormat() {
            return function (d) {
                return d3.format('.02f')(d);
            };
        }

        function yAxisIntegerTickFormat() {
            return function (d) {
                return d3.format('f')(d);
            };
        }

        function yAxisPercentageTickFormat() {
            return function (d) {
                return d3.format('%')(d);
            };
        }

        function xFunction() {
            return function (d) {
                return d.x;
            };
        }

        function yFunction() {
            return function (d) {
                return d.y;
            };
        }

        function getId() {
            return 'chart_' +
                Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return {
            xAxisTickFormat: xAxisTickFormat,
            yAxisTickFormat: yAxisTickFormat,
            yAxisIntegerTickFormat: yAxisIntegerTickFormat,
            yAxisPercentageTickFormat: yAxisPercentageTickFormat,
            xFunction: xFunction,
            yFunction: yFunction,
            getId: getId
        };
    }

    angular
        .module('d3', [])
        .factory('D3Service', D3Service);
 })();
