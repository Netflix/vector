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
    $scope.isConverted = false;
    $scope.forcey = '1';
    $scope.percentage = false;
    $scope.area = false;
    $scope.conversionFunction = 'value/1024/1024';
    $scope.width = '50%';
    $scope.height = '250px';
    $scope.enableVerticalResize = false;

    $scope.advancedOptions = false;
    $scope.uiOptions = false;

    $scope.toggleAdvancedOptions = function() {
      $scope.advancedOptions = !$scope.advancedOptions;
    }

    $scope.toggleUiOptions = function() {
      $scope.uiOptions = !$scope.uiOptions;
    }

    $scope.updateMetric = function() {
      if ($scope.selected) {
        $scope.isCumulative = $scope.selected.sem === 'counter' ? true : false;
      }
    }

    $scope.ok = function() {
      widget.name = $scope.selected.name;
      widget.title = $scope.selected.name;
      widget.dataModelOptions.name = $scope.selected.name;
      widget.dataModelType = 'CustomMetricDataModel';

      if ($scope.isCumulative) {
        // TODO: take cumulative metrics into account on custom metric data model
        widget.dataModelType = 'CustomMetricDataModel';
      }

      if ($scope.isConverted) {
        // TODO: take converted metrics into account on custom metric data model
        widget.dataModelType = 'CustomMetricDataModel';
        widget.dataModelOptions = {
          conversionFunction: function (value) {
            return value/eval($scope.conversionFunction.substr(6));
          }
        }
      }

      widget.attrs = {
        forcey: $scope.forcey,
        integer: !$scope.percentage,
        percentage: $scope.percentage,
        area: $scope.area
      }

      widget.size = {
        width: $scope.width,
        height: $scope.height
      };
      widget.enableVerticalResize = $scope.enableVerticalResize;

      widget.dataModel.update($scope.selected.name, $scope.isCumulative);

      // set up result object
      // TODO: check if this is really required
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
