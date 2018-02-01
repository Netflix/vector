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

    $scope.customWidgetSettings = {
      selected: {
        'name': widget.dataModelOptions.name,
        'text-oneline': ''
      },
      isCumulative: widget.dataModelOptions.isCumulative,
      isConverted: widget.dataModelOptions.isConverted,
      strConversionFunction: widget.dataModelOptions.strConversionFunction,
      forcey: widget.attrs.forcey ? widget.attrs.forcey : '',
      percentage: widget.attrs.percentage,
      area: widget.attrs.area,
      enableVerticalResize: widget.enableVerticalResize
    }

    $scope.state = {
      advancedOptions: $scope.customWidgetSettings.isConverted || $scope.customWidgetSettings.isCumulative || $scope.customWidgetSettings.forcey || $scope.customWidgetSettings.percentage || $scope.customWidgetSettings.area || $scope.customWidgetSettings.enableVerticalResize
    }

    $scope.toggleAdvancedOptions = function() {
      $scope.state.advancedOptions = !$scope.state.advancedOptions;
    }

    $scope.updateMetric = function() {
      if ($scope.customWidgetSettings.selected) {
        $scope.customWidgetSettings.isCumulative = $scope.customWidgetSettings.selected.sem === 'counter' ? true : false;
      }
    }

    $scope.ok = function() {
      $scope.widget.name = $scope.customWidgetSettings.selected.name;
      $scope.widget.title = $scope.customWidgetSettings.selected.name;
      $scope.widget.dataModelOptions.name = $scope.customWidgetSettings.selected.name;
      $scope.widget.dataModelOptions.isCumulative = $scope.customWidgetSettings.isCumulative;
      $scope.widget.dataModelOptions.isConverted = $scope.customWidgetSettings.isConverted;
      $scope.widget.dataModelType = 'CustomMetricDataModel';

      if ($scope.customWidgetSettings.isConverted) {
        $scope.widget.dataModelOptions.strConversionFunction = $scope.customWidgetSettings.strConversionFunction;
      }

      $scope.widget.attrs = {
        forcey: $scope.customWidgetSettings.forcey === '' ? null : $scope.customWidgetSettings.forcey,
        integer: !$scope.customWidgetSettings.percentage,
        percentage: $scope.customWidgetSettings.percentage,
        area: $scope.customWidgetSettings.area
      }

      $scope.widget.enableVerticalResize = $scope.customWidgetSettings.enableVerticalResize;

      // set up result object
      // $scope.result = angular.extend({}, $scope.result, widget);

      $uibModalInstance.close($scope.widget);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular
    .module('customWidgetSettings', [])
    .controller('CustomWidgetSettingsController', CustomWidgetSettingsCtrl);
})();
