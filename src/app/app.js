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

    angular
        .module('app.routes', ['ngRoute']);

    angular
        .module('app.config', []);

    angular
        .module('app.constants', []);

    angular
        .module('app.version', []);

    angular
        .module('app.charts', []);

    angular
        .module('app.filters', []);

    angular
        .module('app.metrics', []);

    angular
        .module('app.datamodels', []);

    angular
        .module('app.services', []);

    angular
        .module('app.decorators', []);

    angular
        .module('app.extensions', []);

    angular
        .module('vector', [
            'ui.dashboard',
            'toastr',
            'app.routes',
            'app.dashboard',
            'app.datamodels',
            'app.widgets',
            'app.charts',
            'app.services',
            'app.filters',
            'app.metrics',
            'app.decorators',
            'app.config',
            'app.constants',
            'app.version',
            'app.extensions'
        ]);

})();
