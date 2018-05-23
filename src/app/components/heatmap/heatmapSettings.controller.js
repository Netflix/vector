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

/*eslint-disable angular/controller-as*/

(function () {
    'use strict';

    function HeatmapSettingsCtrl($scope, $uibModalInstance, widget) {
        $scope.widget = widget;
        $scope.result = angular.extend({}, $scope.result, widget);
        $scope.dataModelOptions = angular.extend({}, $scope.dataModelOptions, widget.dataModelOptions);

        $scope.ok = function () {
          // change the underlying values only if the OK button was pressed
          $scope.result.dataModelOptions = $scope.dataModelOptions;
          $uibModalInstance.close($scope.result);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('heatmap')
        .controller('HeatmapSettingsController', HeatmapSettingsCtrl);
})();
