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
/*global angular*/
/*jslint plusplus: true */

(function () {
    'use strict';

    /* Filters */

    /**
    * @name uniqueItems
    * @desc
    */
    function uniqueItems(data, key) {
        var result = [],
            i,
            value;
        for (i = 0; i < data.length; i++) {
            value = data[i][key];
            if (result.indexOf(value) === -1) {
                result.push(value);
            }
        }
        return result;
    }

    /**
    * @name groupBy
    * @desc
    */
    function groupBy() {
        return function (collection, key) {
            if (collection === null) {
                return;
            }
            return uniqueItems(collection, key);
        };
    }

    /**
    * @name groupFilter
    * @desc
    */
    function groupFilter() {
        return function (collection, group) {
            return collection.filter(function (item) {
                return item.group === group;
            });
        };
    }

    angular
        .module('vector')
        .filter('groupBy', groupBy)
        .filter('groupFilter', groupFilter);

})();
