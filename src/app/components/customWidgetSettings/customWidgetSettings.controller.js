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

/*eslint-disable angular/controller-as*/

(function () {
  'use strict';
  
  function CustomWidgetSettingsCtrl($scope, $uibModalInstance, widget) {
    // add widget to scope
    $scope.widget = widget;
    
    $scope.selected = {
      'name': '',
      'text-oneline': ''
    };

    $scope.isCumulative = false;

    $scope.updateMetric = function() {
      if ($scope.selected) {
        $scope.isCumulative = $scope.selected.sem === 'counter' ? true : false;
      }
    }

    $scope.ok = function() {
      widget.name = $scope.selected.name;
      widget.title = $scope.selected.name;
      widget.dataModelOptions.name = $scope.selected.name;
      widget.dataModelType = 'MetricDataModel';

      if ($scope.isCumulative) {
        widget.dataModelType = 'CumulativeMetricDataModel';
      }

      widget.dataModel.update($scope.selected.name, $scope.isCumulative);

      // set up result object
      $scope.result = angular.extend({}, $scope.result, widget);

      $uibModalInstance.close($scope.result);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular
    .module('customWidgetSettings', [])
    .controller('CustomWidgetSettingsController', CustomWidgetSettingsCtrl);
})();
