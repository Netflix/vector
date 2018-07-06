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

// external imports (js and CSS), will be bundled by webpack
require('./vendors')

// local CSS, will be bundled by webpack
require('./_reboot.min.css')
require('./index.css')

// lots of other components rely on the vector module having been declared first
// so do it early
require('./main/main.controller')
angular.module('vector', [
    'ngRoute',
    'ui.dashboard',
    'main',
    'toastr'
  ])

// load anything else in
require('./index.route')
require('./index.config')
require('./index.constants')
require('./index.decorators')
require('./index.extensions')
require('./index.filters')

// all the remaining components, particularly vector specific angular components
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
requireAll(require.context('./components/', true, /\.module\.js$/));
requireAll(require.context('./components/', true, /\.model\.js$/));
requireAll(require.context('./components/', true, /\.service\.js$/));
requireAll(require.context('./components/', true, /\.factory\.js$/));
requireAll(require.context('./components/', true, /\.controller\.js$/));
requireAll(require.context('./components/', true, /\.directive\.js$/));

// explicit react require
require('./components/dashboard/dashboard-footer.jsx')
require('./components/dashboard/widget-header.jsx')

// other stuff
require('./components/chart/nvd3-tooltip')
