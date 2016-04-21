
(function () {
    'use strict';

    function CustomWidgetSettingsCtrl($scope, $uibModalInstance, widget) {
        $scope.widget = widget;
        $scope.result = angular.extend({},$scope.result, widget);

        $scope.ok = function () {
          $uibModalInstance.close($scope.result);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('app.dashboard')
        .controller('CustomWidgetSettingsController', CustomWidgetSettingsCtrl);
})();
