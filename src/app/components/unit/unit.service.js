/**!
 *
 *  Copyright 2018 Andreas Gerstmayr, Inc.
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
    * @name UnitService
    * @desc
    */
    function UnitService() {

        function convert(a, b, unit) {
            var units,
                bases;

            if (unit[unit.length - 1] == 's') {
                units = ['ns', 'us', 'ms', 's', 'm', 'h', 'd'];
                bases = [1000, 1000, 1000, 1000, 60, 60, 24];
            }
            else if (unit[unit.length - 1] == 'B') {
                units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
                bases = [1024, 1024, 1024, 1024, 1024, 1024];
            }
            else {
                var baseUnit = unit.length > 1 ? unit.substr(1) : unit;
                units = ['n', 'u', 'm', '', 'k', 'M', 'G', 'T', 'P'].map(function(u) { return u + baseUnit; });
                bases = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];
            }

            var unitIdx = units.indexOf(unit);
            while (unitIdx + 1 < units.length && a >= bases[unitIdx + 1] && b >= bases[unitIdx + 1]) {
                a /= bases[unitIdx + 1];
                b /= bases[unitIdx + 1];
                unitIdx++;
            }
            return [Math.round(a), Math.round(b), units[unitIdx]];
        }

        return {
            convert: convert
        };
    }

    angular
        .module('unit', [])
        .factory('UnitService', UnitService);
 })();
