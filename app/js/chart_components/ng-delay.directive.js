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

(function () {
    'use strict';

    function ngDelay($timeout) {
        function compile(element, attributes) {
            var expression = attributes.ngChange;
            if (!expression)
                return;

            var ngModel = attributes.ngModel;
            if (ngModel)
                attributes.ngModel = '$parent.' + ngModel;

            attributes.ngChange = '$$delay.execute()';

            return {
                post: function (scope, element, attributes) {
                    scope.$$delay = {
                        expression: expression,
                        delay: scope.$eval(attributes.ngDelay),
                        execute: function () {
                            var state = scope.$$delay;
                            state.then = Date.now();
                            $timeout(function () {
                                if (Date.now() - state.then >= state.delay)
                                    scope.$parent.$eval(expression);
                            }, state.delay);
                        }
                    };
                }
            };
        }

        return {
            restrict: 'A',
            scope: true,
            compile: compile
        };
    }

    angular
        .module('app.directives')
        .directive('ngDelay', ngDelay);

})();
