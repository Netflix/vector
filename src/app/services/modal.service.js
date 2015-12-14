/**!
 */
 (function () {
     'use strict';

     /**
     * @name ModalService
     * @desc
     */
     function ModalService($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            template: '<div class="modal-header"><h3>{{modalOptions.headerText}}</h3></div><div class="modal-body"><p>{{modalOptions.bodyText}}</p></div><div class="modal-footer"><button type="button" class="btn" data-ng-click="modalOptions.close()">{{modalOptions.closeButtonText}}</button><button class="btn btn-primary" data-ng-click="modalOptions.ok();">{{modalOptions.actionButtonText}}</button></div>'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        /**
        * @name showModal
        * @desc
        */
        function showModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) {
                customModalDefaults = {};
            }
            customModalDefaults.backdrop = 'static';
            return show(customModalDefaults, customModalOptions);
        }

        /**
        * @name show
        * @desc
        */
        function show(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                };
            }

            return $modal.open(tempModalDefaults).result;
        }

        ///////

        return {
            show: show,
            showModal: showModal
        };

    }

    angular
        .module('app.services')
        .factory('ModalService', ['$modal', ModalService]);

 })();