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

/*jslint node: true */
/*global angular*/
(function () {
    'use strict';

    /**
    * @name flashConfig
    * @desc Configures flashProvider to use Bootstrap 3 CSS class.
    */
    function flashConfig(flashProvider)  {
        flashProvider.errorClassnames.push('alert-danger');
    }

    angular
        .module('app.routes', ['ngRoute']);

    angular
        .module('vector.config', []);

    angular
        .module('vector.version', []);

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
        .module('app', [
            'app.routes',
            'ui.dashboard',
            'app.controllers',
            'app.datamodels',
            'app.widgets',
            'app.charts',
            'app.services',
            'app.filters',
            'app.metrics',
            'vector.config',
            'vector.version',
            'angular-flash.service',
            'angular-flash.flash-alert-directive'
        ])
        .config(flashConfig);

})();
