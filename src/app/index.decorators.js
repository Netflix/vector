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

    /* Decorators */

    function decorators($provide) {
        /* Register a decorator for the `$interval` service */
        $provide.decorator('$interval', function ($delegate) {

            /* Keep a reference to the original `cancel()` method */
            var originalCancel = $delegate.cancel;

            /* Define a new `cancel()` method */
            $delegate.cancel = function (intervalPromise) {

                /* First, call the original `cancel()` method */
                var retValue = originalCancel(intervalPromise);

                /* If the promise has been successfully cancelled,
                 * add a `cancelled` property (with value `true`) */
                if (retValue && intervalPromise) {
                    intervalPromise.isCancelled = true;
                }

                /* Return the value returned by the original method */
                return retValue;
            };

            /* Return the original (but "augmented") service */
            return $delegate;
        });
    }

    angular
        .module('vector')
        .config(decorators);

})();
