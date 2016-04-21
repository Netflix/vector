
(function () {
    'use strict';

    function CustomWidgetSettingsCtrl($uibModalInstance, widget) {
        var vm = this;

        vm.widget = widget;
        vm.result = angular.extend({}, vm.result, widget);

        vm.ok = function () {
          $uibModalInstance.close(vm.result);
        };

        vm.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
    }

    angular
        .module('app.dashboard')
        .controller('CustomWidgetSettingsController', CustomWidgetSettingsCtrl);
})();
