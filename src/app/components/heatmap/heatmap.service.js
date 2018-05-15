/**!
 *
 *  Copyright 2018 Andreas Gerstmayr
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
     * @name HeatmapService
     */
     function HeatmapService($rootScope) {

        function analyzeMetadata(rawData, maxRow) {
            var interval = parseInt($rootScope.properties.interval),
                window = parseFloat($rootScope.properties.window);
            var data = {
                rows: [Infinity],
                columns: [],
                values: []
            };

            if (rawData.length === 0 || rawData[0].values.length === 0) {
                return data;
            }

            for (var i = 0; i < rawData.length; i++) {
                var instance = rawData[i];
                var row = parseInt(instance.key.split('-')[1]);
                if (row <= maxRow) {
                    data.rows.push(row);
                }
            }
            data.rows.sort(function(a,b) { return b - a; }); // sort reversed numerical

            var lastTimestamp = parseInt(rawData[0].values[rawData[0].values.length-1].x / 1000);
            var numCols = Math.ceil(window * 60 / interval);
            for (var ts = lastTimestamp - interval * (numCols - 1); ts <= lastTimestamp; ts += interval) {
                data.columns.push(ts);
                data.values.push(new Array(data.rows.length).fill(null));
            }

            return data;
        }

        function generate(rawData, maxRow) {
            var interval = parseInt($rootScope.properties.interval);
            var data = analyzeMetadata(rawData, maxRow, data);

            for (var i = 0; i < rawData.length; i++) {
                var instance = rawData[i];
                var row = parseInt(instance.key.split('-')[1]);
                if (row > maxRow) {
                    row = Infinity;
                }
                var rowIdx = data.rows.indexOf(row);

                for(var j = 0; j < instance.values.length; j++) {
                    var timestamp = parseInt(instance.values[j].x / 1000);
                    if (timestamp < data.columns[0]) {
                        continue;
                    }
                    var column = Math.ceil((timestamp - data.columns[0]) / interval);
                    if (row === Infinity) {
                        data.values[column][rowIdx] += instance.values[j].y * interval;
                    }
                    else {
                        data.values[column][rowIdx] = instance.values[j].y * interval;
                    }
                }
            }

            return data;
        }

        return {
            generate: generate
        };
    }

    angular
        .module('heatmap')
        .factory('HeatmapService', HeatmapService);

 })();
