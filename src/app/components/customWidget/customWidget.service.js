/**!
 *
 *  Copyright 2016 Netflix, Inc.
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
     * @name CustomWidgetServices
     * @desc
     */
     function CustomWidgetService($uibModal) {

        var defaultModal = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/components/modal/defaultModal.html'
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
        function showCustomWidgetModal(customModal, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var modal = {};
            var modalOptions = {};

            customModal.backdrop = 'static';

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(modal, defaultModal, customModal);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(modalOptions, defaultModalOptions, customModalOptions);

            modal.controller = ['$scope','$uibModalInstance', 'widgetOptions', function ($scope, $uibModalInstance, widgetOptions) {
                $scope.selected = {
                  name: '',
                  'text-oneline':''
                };
                $scope.widgetOptions = {};
                angular.extend($scope.widgetOptions, widgetOptions);
                $scope.modalOptions = modalOptions;
                $scope.modalOptions.ok = function (result) {
                    widgetOptions.name = $scope.selected.name;
                    widgetOptions.title = $scope.selected.name;
                    widgetOptions.dataModelOptions.name = $scope.selected.name;
                    $uibModalInstance.close(result);
                };
                $scope.modalOptions.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }];

            return $uibModal.open(modal).result;
        }

        return {
            showCustomWidgetModal: showCustomWidgetModal
        };

    }


    angular
        .module('customwidget' , [])
        .factory('CustomWidgetService', CustomWidgetService);

 })();
