/**!
 */
 (function () {
     'use strict';

     /**
     * @name ModalService
     * @desc
     */
     function ModalService($uibModal) {

        var defaultModal = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            template: '<div class="modal-header"><h3>{{modalOptions.headerText}}</h3></div><div class="modal-body"><p>{{modalOptions.bodyText}}</p></div><div class="modal-footer"><button type="button" class="btn" data-ng-click="modalOptions.close()">{{modalOptions.closeButtonText}}</button><button class="btn btn-primary" data-ng-click="modalOptions.ok();">{{modalOptions.actionButtonText}}</button></div>'
        };

        var defaultModalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        /**
        * @name show
        * @desc
        */
        function showModal(customModal, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var modal = {};
            var modalOptions = {};

            customModal.backdrop = 'static';

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(modal, defaultModal, customModal);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(modalOptions, defaultModalOptions, customModalOptions);

            modal.controller = ['$scope','$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.modalOptions = modalOptions;
                $scope.modalOptions.ok = function (result) {
                    $uibModalInstance.close(result);
                };
                $scope.modalOptions.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }];

            return $uibModal.open(modal).result;
        }

        return {
            showModal: showModal
        };

    }

    angular
        .module('app.services')
        .factory('ModalService', ModalService);

 })();
