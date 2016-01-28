
(function () {
    'use strict';

angular.module('ui.dashboard')
  .controller('customWidgetSettingsCtrl', ['$scope', '$modalInstance', 'widget', function ($scope, $modalInstance, widget) {

    $scope.widget = widget;
    $scope.result = angular.extend({},$scope.result, widget);

    $scope.ok = function () {
      $modalInstance.close($scope.result);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);

})();