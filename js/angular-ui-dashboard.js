/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('ui.dashboard', ['ui.bootstrap', 'ui.sortable']);

angular.module('ui.dashboard')
  .directive('dashboard', ['WidgetModel', 'WidgetDefCollection', '$modal', 'DashboardState', function (WidgetModel, WidgetDefCollection, $modal, DashboardState) {
    return {
      restrict: 'A',
      templateUrl: function(element, attr) { return attr.templateUrl ? attr.templateUrl : 'template/dashboard.html'; },
      scope: true,

      controller: ['$scope',function ($scope) {
        $scope.sortableOptions = {
          stop: function () {
            $scope.saveDashboard();
          },
          handle: '.widget-header'
        };
        
      }],
      link: function (scope, element, attrs) {

        // default options
        var defaults = {
          stringifyStorage: true
        };

        scope.options = scope.$eval(attrs.dashboard);

        // from dashboard="options"
        angular.extend(defaults, scope.options);
        angular.extend(scope.options, defaults);

        // Save default widget config for reset
        scope.defaultWidgets = scope.options.defaultWidgets;
        
        //scope.widgetDefs = scope.options.widgetDefinitions;
        scope.widgetDefs = new WidgetDefCollection(scope.options.widgetDefinitions);
        var count = 1;

        // Instantiate new instance of dashboard state
        scope.dashboardState = new DashboardState(
          scope.options.storage,
          scope.options.storageId,
          scope.options.storageHash,
          scope.widgetDefs,
          scope.options.stringifyStorage
        );

        /**
         * Instantiates a new widget on the dashboard
         * @param {Object} widgetToInstantiate The definition object of the widget to be instantiated
         */
        scope.addWidget = function (widgetToInstantiate, doNotSave) {
          var defaultWidgetDefinition = scope.widgetDefs.getByName(widgetToInstantiate.name);
          if (!defaultWidgetDefinition) {
            throw 'Widget ' + widgetToInstantiate.name + ' is not found.';
          }

          // Determine the title for the new widget
          var title;
          if (widgetToInstantiate.title) {
            title = widgetToInstantiate.title;
          } else if (defaultWidgetDefinition.title) {
            title = defaultWidgetDefinition.title;
          } else {
            title = 'Widget ' + count++;
          }

          // Deep extend a new object for instantiation
          widgetToInstantiate = jQuery.extend(true, {}, defaultWidgetDefinition, widgetToInstantiate);

          // Instantiation
          var widget = new WidgetModel(widgetToInstantiate, {
            title: title
          });

          scope.widgets.push(widget);
          if (!doNotSave) {
            scope.saveDashboard();
          }
        };

        /**
         * Removes a widget instance from the dashboard
         * @param  {Object} widget The widget instance object (not a definition object)
         */
        scope.removeWidget = function (widget) {
          scope.widgets.splice(_.indexOf(scope.widgets, widget), 1);
          scope.saveDashboard();
        };

        /**
         * Opens a dialog for setting and changing widget properties
         * @param  {Object} widget The widget instance object
         */
        scope.openWidgetDialog = function (widget) {
          var options = widget.editModalOptions;

          // use default options when none are supplied by widget
          if (!options) {
            options = {
              templateUrl: 'template/widget-template.html',
              resolve: {
                widget: function () {
                  return widget;
                },
                optionsTemplateUrl: function () {
                  return scope.options.optionsTemplateUrl;
                }
              },
              controller: 'WidgetDialogCtrl'
            };
          }
          var modalInstance = $modal.open(options);

          // Set resolve and reject callbacks for the result promise
          modalInstance.result.then(
            function (result) {
              console.log('widget dialog closed');
              console.log('result: ', result);
              widget.title = result.title;
              //AW Persist title change from options editor
              scope.$emit('widgetChanged', widget);
            },
            function (reason) {
              console.log('widget dialog dismissed: ', reason);

            }
          );

        };

        /**
         * Remove all widget instances from dashboard
         */
        scope.clear = function (doNotSave) {
          scope.widgets = [];
          if (doNotSave === true) {
            return;
          }
          scope.saveDashboard();
        };

        /**
         * Used for preventing default on click event
         * @param {Object} event     A click event
         * @param {Object} widgetDef A widget definition object
         */
        scope.addWidgetInternal = function (event, widgetDef) {
          event.preventDefault();
          scope.addWidget(widgetDef);
        };

        /**
         * Uses dashboardState service to save state
         */
        scope.saveDashboard = function (force) {
          if (!scope.options.explicitSave) {
            scope.dashboardState.save(scope.widgets);
          } else {
            if (typeof scope.options.unsavedChangeCount !== 'number') {
              scope.options.unsavedChangeCount = 0;
            }
            if (force) {
              scope.options.unsavedChangeCount = 0;
              scope.dashboardState.save(scope.widgets);

            } else {
              ++scope.options.unsavedChangeCount;
            }
          }
        };

        /**
         * Wraps saveDashboard for external use.
         */
        scope.externalSaveDashboard = function() {
          scope.saveDashboard(true);
        };

        /**
         * Clears current dash and instantiates widget definitions
         * @param  {Array} widgets Array of definition objects
         */
        scope.loadWidgets = function (widgets) {
          // AW dashboards are continuously saved today (no "save" button).
          //scope.defaultWidgets = widgets;
          scope.savedWidgetDefs = widgets;
          scope.clear(true);
          _.each(widgets, function (widgetDef) {
            scope.addWidget(widgetDef, true);
          });
        };

        /**
         * Resets widget instances to default config
         * @return {[type]} [description]
         */
        scope.resetWidgetsToDefault = function () {
          scope.loadWidgets(scope.defaultWidgets);
          scope.saveDashboard();
        };

        // Set default widgets array
        var savedWidgetDefs = scope.dashboardState.load();

        // Success handler
        function handleStateLoad(saved) {
          if (saved && saved.length) {
            scope.loadWidgets(saved);
          } else if (scope.defaultWidgets) {
            scope.resetWidgetsToDefault();
          } else {
            scope.clear(true);
          }
        }

        if (savedWidgetDefs instanceof Array) {
          handleStateLoad(savedWidgetDefs);
        }
        else if (savedWidgetDefs && typeof savedWidgetDefs === 'object' && typeof savedWidgetDefs.then === 'function') {
          savedWidgetDefs.then(handleStateLoad, handleStateLoad);
        }
        else {
          handleStateLoad();
        }

        // expose functionality externally
        // functions are appended to the provided dashboard options
        scope.options.addWidget = scope.addWidget;
        scope.options.loadWidgets = scope.loadWidgets;
        scope.options.saveDashboard = scope.externalSaveDashboard;


        // save state
        scope.$on('widgetChanged', function (event) {
          event.stopPropagation();
          scope.saveDashboard();
        });
      }
    };
  }]);

/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .directive('widget', function () {

    return {

      controller: 'DashboardWidgetCtrl',

      link: function (scope) {

        var widget = scope.widget;
        // set up data source
        if (widget.dataModelType) {
          var ds = new widget.dataModelType();
          widget.dataModel = ds;
          ds.setup(widget, scope);
          ds.init();
          scope.$on('$destroy', _.bind(ds.destroy,ds));
        }

        // Compile the widget template, emit add event
        scope.compileTemplate();
        scope.$emit('widgetAdded', widget);

      }

    };
  });
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .factory('DashboardState', ['$log', '$q', function ($log, $q) {
    function DashboardState(storage, id, hash, widgetDefinitions, stringify) {
      this.storage = storage;
      this.id = id;
      this.hash = hash;
      this.widgetDefinitions = widgetDefinitions;
      this.stringify = stringify;
    }

    DashboardState.prototype = {
      /**
       * Takes array of widget instance objects, serializes, 
       * and saves state.
       * 
       * @param  {Array} widgets  scope.widgets from dashboard directive
       * @return {Boolean}        true on success, false on failure
       */
      save: function (widgets) {
        
        if (!this.storage) {
          return true;
        }

        var serialized = _.map(widgets, function (widget) {
          var widgetObject = {
            title: widget.title,
            name: widget.name,
            style: widget.style,
            dataModelOptions: widget.dataModelOptions,
            storageHash: widget.storageHash,
            attrs: widget.attrs
          };

          return widgetObject;
        });

        var item = { widgets: serialized, hash: this.hash };

        if (this.stringify) {
          item = JSON.stringify(item);
        }

        this.storage.setItem(this.id, item);
        return true;
      },

      /**
       * Loads dashboard state from the storage object.
       * Can handle a synchronous response or a promise.
       * 
       * @return {Array|Promise} Array of widget definitions or a promise
       */
      load: function () {

        if (!this.storage) {
          return null;
        }

        var serialized;

        // try loading storage item
        serialized = this.storage.getItem( this.id );

        if (serialized) {
          // check for promise
          if (typeof serialized === 'object' && typeof serialized.then === 'function') {
            return this._handleAsyncLoad(serialized);
          }
          // otherwise handle synchronous load
          return this._handleSyncLoad(serialized);
        } else {
          return null;
        }
      },

      _handleSyncLoad: function(serialized) {

        var deserialized, result = [];

        if (!serialized) {
          return null;
        }

        if (this.stringify) {
          try { // to deserialize the string

            deserialized = JSON.parse(serialized);

          } catch (e) {

            // bad JSON, log a warning and return
            $log.warn('Serialized dashboard state was malformed and could not be parsed: ', serialized);
            return null;

          }
        }
        else {
          deserialized = serialized;
        }

        // check hash against current hash
        if (deserialized.hash !== this.hash) {

          $log.info('Serialized dashboard from storage was stale (old hash: ' + deserialized.hash + ', new hash: ' + this.hash + ')');
          this.storage.removeItem(this.id);
          return null;

        }

        // Cache widgets
        var savedWidgetDefs = deserialized.widgets;

        // instantiate widgets from stored data
        for (var i = 0; i < savedWidgetDefs.length; i++) {

          // deserialized object
          var savedWidgetDef = savedWidgetDefs[i];

          // widget definition to use
          var widgetDefinition = this.widgetDefinitions.getByName(savedWidgetDef.name);

          // check for no widget
          if (!widgetDefinition) {
            // no widget definition found, remove and return false
            $log.warn('Widget with name "' + savedWidgetDef.name + '" was not found in given widget definition objects');
            continue;
          }

          // check widget-specific storageHash
          if (widgetDefinition.hasOwnProperty('storageHash') && widgetDefinition.storageHash !== savedWidgetDef.storageHash) {
            // widget definition was found, but storageHash was stale, removing storage
            $log.info('Widget Definition Object with name "' + savedWidgetDef.name + '" was found ' +
              'but the storageHash property on the widget definition is different from that on the ' +
              'serialized widget loaded from storage. hash from storage: "' + savedWidgetDef.storageHash + '"' +
              ', hash from WDO: "' + widgetDefinition.storageHash + '"');
            continue;
          }

          // push instantiated widget to result array
          result.push(savedWidgetDef);
        }

        return result;
      },

      _handleAsyncLoad: function(promise) {
        var self = this;
        var deferred = $q.defer();
        promise.then(
          // success
          function(res) {
            var result = self._handleSyncLoad(res);
            if (result) {
              deferred.resolve(result);
            } else {
              deferred.reject(result);
            }
          },
          // failure
          function(res) {
            deferred.reject(res);
          }
        );

        return deferred.promise;
      }

    };
    return DashboardState;
  }]);
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .factory('WidgetDataModel', function () {
    function WidgetDataModel() {
    }

    WidgetDataModel.prototype = {
      setup: function (widget, scope) {
        this.dataAttrName = widget.dataAttrName;
        this.dataModelOptions = widget.dataModelOptions;
        this.widgetScope = scope;
      },

      updateScope: function (data) {
        this.widgetScope.widgetData = data;
      },

      init: function () {
        // to be overridden by subclasses
      },

      destroy: function () {
        // to be overridden by subclasses
      }
    };

    return WidgetDataModel;
  });
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .factory('WidgetDefCollection', function () {
    function WidgetDefCollection(widgetDefs) {
      this.push.apply(this, widgetDefs);

      // build (name -> widget definition) map for widget lookup by name
      var map = {};
      _.each(widgetDefs, function (widgetDef) {
        map[widgetDef.name] = widgetDef;
      });
      this.map = map;
    }

    WidgetDefCollection.prototype = Object.create(Array.prototype);

    WidgetDefCollection.prototype.getByName = function (name) {
      return this.map[name];
    };

    return WidgetDefCollection;
  });
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .factory('WidgetModel', function () {
    // constructor for widget model instances
    function WidgetModel(Class, overrides) {
      var defaults = {
          title: 'Widget',
          name: Class.name,
          attrs: Class.attrs,
          dataAttrName: Class.dataAttrName,
          dataModelType: Class.dataModelType,
          //AW Need deep copy of options to support widget options editing
          dataModelOptions: Class.dataModelOptions,
          style: Class.style
        };
      overrides = overrides || {};
      angular.extend(this, angular.copy(defaults), overrides);
      this.style = this.style || { width: '33%' };
      this.setWidth(this.style.width);

      if (Class.templateUrl) {
        this.templateUrl = Class.templateUrl;
      } else if (Class.template) {
        this.template = Class.template;
      } else {
        var directive = Class.directive || Class.name;
        this.directive = directive;
      }
    }

    WidgetModel.prototype = {
      // sets the width (and widthUnits)
      setWidth: function (width, units) {
        width = width.toString();
        units = units || width.replace(/^[-\.\d]+/, '') || '%';
        this.widthUnits = units;
        width = parseFloat(width);

        if (width < 0) {
          return false;
        }

        if (units === '%') {
          width = Math.min(100, width);
          width = Math.max(0, width);
        }
        this.style.width = width + '' + units;
        return true;
      }
    };

    return WidgetModel;
  });
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .controller('DashboardWidgetCtrl', ['$scope', '$element', '$compile', '$window', '$timeout', function($scope, $element, $compile, $window, $timeout) {

    // Fills "container" with compiled view
    $scope.makeTemplateString = function() {

      var widget = $scope.widget;

      // First, build template string
      var templateString = '';

      if (widget.templateUrl) {
        
        // Use ng-include for templateUrl
        templateString = '<div ng-include="\'' + widget.templateUrl + '\'"></div>';

      } else if (widget.template) {

        // Direct string template
        templateString = widget.template;

      } else {

        // Assume attribute directive
        templateString = '<div ' + widget.directive;

        // Check if data attribute was specified
        if (widget.dataAttrName) {
          widget.attrs = widget.attrs || {};
          widget.attrs[widget.dataAttrName] = 'widgetData';
        }

        // Check for specified attributes
        if (widget.attrs) {

          // First check directive name attr
          if (widget.attrs[widget.directive]) {
            templateString += '="' + widget.attrs[widget.directive] + '"';
          }

          // Add attributes
          _.each(widget.attrs, function (value, attr) {

            // make sure we aren't reusing directive attr
            if (attr !== widget.directive) {
              templateString += ' ' + attr + '="' + value + '"';
            }
            
          });
        }
        templateString += '></div>';
      }
      return templateString;
    };

    $scope.grabResizer = function (e) {

      var widget = $scope.widget;
      var widgetElm = $element.find('.widget');

      // ignore middle- and right-click
      if (e.which !== 1) {
        return;
      }

      e.stopPropagation();
      e.originalEvent.preventDefault();

      // get the starting horizontal position
      var initX = e.clientX;
      // console.log('initX', initX);

      // Get the current width of the widget and dashboard
      var pixelWidth = widgetElm.width();
      var pixelHeight = widgetElm.height();
      var widgetStyleWidth = widget.style.width;
      var widthUnits = widget.widthUnits;
      var unitWidth = parseFloat(widgetStyleWidth);

      // create marquee element for resize action
      var $marquee = angular.element('<div class="widget-resizer-marquee" style="height: ' + pixelHeight + 'px; width: ' + pixelWidth + 'px;"></div>');
      widgetElm.append($marquee);

      // determine the unit/pixel ratio
      var transformMultiplier = unitWidth / pixelWidth;

      // updates marquee with preview of new width
      var mousemove = function (e) {
        var curX = e.clientX;
        var pixelChange = curX - initX;
        var newWidth = pixelWidth + pixelChange;
        $marquee.css('width', newWidth + 'px');
      };

      // sets new widget width on mouseup
      var mouseup = function (e) {
        // remove listener and marquee
        jQuery($window).off('mousemove', mousemove);
        $marquee.remove();

        // calculate change in units
        var curX = e.clientX;
        var pixelChange = curX - initX;
        var unitChange = Math.round(pixelChange * transformMultiplier * 100) / 100;

        // add to initial unit width
        var newWidth = unitWidth * 1 + unitChange;
        widget.setWidth(newWidth + widthUnits);
        $scope.$emit('widgetChanged', widget);
        $scope.$apply();
      };

      jQuery($window).on('mousemove', mousemove).one('mouseup', mouseup);
    };

    // replaces widget title with input
    $scope.editTitle = function (widget) {
      var widgetElm = $element.find('.widget');
      widget.editingTitle = true;
      // HACK: get the input to focus after being displayed.
      $timeout(function () {
        widgetElm.find('form.widget-title input:eq(0)').focus()[0].setSelectionRange(0, 9999);
      });
    };

    // saves whatever is in the title input as the new title
    $scope.saveTitleEdit = function (widget) {
      widget.editingTitle = false;
      $scope.$emit('widgetChanged', widget);
    };

    $scope.compileTemplate = function() {
      var container = $scope.findWidgetContainer($element);
      var templateString = $scope.makeTemplateString();
      var widgetElement = angular.element(templateString);

      container.empty();
      container.append(widgetElement);
      $compile(widgetElement)($scope);
    };

    $scope.findWidgetContainer = function(element) {
      // widget placeholder is the first (and only) child of .widget-content
      return element.find('.widget-content');
    };
  }]);
/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .controller('WidgetDialogCtrl', ['$scope', '$modalInstance', 'widget', 'optionsTemplateUrl', function ($scope, $modalInstance, widget, optionsTemplateUrl) {
    // add widget to scope
    $scope.widget = widget;

    // set up result object
    $scope.result = {
      title: widget.title
    };

    // look for optionsTemplateUrl on widget
    $scope.optionsTemplateUrl = optionsTemplateUrl || 'template/widget-default-content.html';

    $scope.ok = function () {
      $modalInstance.close($scope.result);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
angular.module("ui.dashboard").run(["$templateCache", function($templateCache) {

  $templateCache.put("template/alt-dashboard.html",
    "<div>\n" +
    "    <div class=\"btn-toolbar\" ng-if=\"!options.hideToolbar\">\n" +
    "        <div class=\"btn-group\" ng-if=\"!options.widgetButtons\">\n" +
    "            <button type=\"button\" class=\"dropdown-toggle btn btn-primary\" data-toggle=\"dropdown\">Add Widget <span\n" +
    "                    class=\"caret\"></span></button>\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"widget in widgetDefs\">\n" +
    "                    <a href=\"#\" ng-click=\"addWidgetInternal($event, widget);\"><span class=\"label label-primary\">{{widget.name}}</span></a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"btn-group\" ng-if=\"options.widgetButtons\">\n" +
    "            <button ng-repeat=\"widget in widgetDefs\"\n" +
    "                    ng-click=\"addWidgetInternal($event, widget);\" type=\"button\" class=\"btn btn-primary\">\n" +
    "                {{widget.name}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"resetWidgetsToDefault()\">Default Widgets</button>\n" +
    "\n" +
    "        <button ng-if=\"options.storage && options.explicitSave\" ng-click=\"options.saveDashboard()\" class=\"btn btn-success\" ng-hide=\"!options.unsavedChangeCount\">{{ !options.unsavedChangeCount ? \"Alternative - No Changes\" : \"Save\" }}</button>\n" +
    "\n" +
    "        <button ng-click=\"clear();\" ng-hide=\"!widgets.length\" type=\"button\" class=\"btn btn-info\">Clear</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ui-sortable=\"sortableOptions\" ng-model=\"widgets\" class=\"dashboard-widget-area\">\n" +
    "        <div ng-repeat=\"widget in widgets\" ng-style=\"widget.style\" class=\"widget-container\" widget>\n" +
    "            <div class=\"widget panel panel-default\">\n" +
    "                <div class=\"widget-header panel-heading\">\n" +
    "                    <h3 class=\"panel-title\">\n" +
    "                        <span class=\"widget-title\" ng-dblclick=\"editTitle(widget)\" ng-hide=\"widget.editingTitle\">{{widget.title}}</span>\n" +
    "                        <form action=\"\" class=\"widget-title\" ng-show=\"widget.editingTitle\" ng-submit=\"saveTitleEdit(widget)\">\n" +
    "                            <input type=\"text\" ng-model=\"widget.title\" class=\"form-control\">\n" +
    "                        </form>\n" +
    "                        <span class=\"label label-primary\" ng-if=\"!options.hideWidgetName\">{{widget.name}}</span>\n" +
    "                        <span ng-click=\"removeWidget(widget);\" class=\"glyphicon glyphicon-remove\" ng-if=\"!options.hideWidgetClose\"></span>\n" +
    "                        <span ng-click=\"openWidgetDialog(widget);\" class=\"glyphicon glyphicon-cog\" ng-if=\"!options.hideWidgetOptions\"></span>\n" +
    "                    </h3>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body widget-content\"></div>\n" +
    "                <div class=\"widget-ew-resizer\" ng-mousedown=\"grabResizer($event)\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );

  $templateCache.put("template/dashboard.html",
    "<div>\n" +
    "    <div class=\"btn-toolbar\" ng-if=\"!options.hideToolbar\">\n" +
    "        <div class=\"btn-group\" ng-if=\"!options.widgetButtons\">\n" +
    "            <button type=\"button\" class=\"dropdown-toggle btn btn-primary\" data-toggle=\"dropdown\">Add Widget <span\n" +
    "                    class=\"caret\"></span></button>\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"widget in widgetDefs\">\n" +
    "                    <a href=\"#\" ng-click=\"addWidgetInternal($event, widget);\"><span class=\"label label-primary\">{{widget.name}}</span></a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"btn-group\" ng-if=\"options.widgetButtons\">\n" +
    "            <button ng-repeat=\"widget in widgetDefs\"\n" +
    "                    ng-click=\"addWidgetInternal($event, widget);\" type=\"button\" class=\"btn btn-primary\">\n" +
    "                {{widget.name}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"resetWidgetsToDefault()\">Default Widgets</button>\n" +
    "\n" +
    "        <button ng-if=\"options.storage && options.explicitSave\" ng-click=\"options.saveDashboard()\" class=\"btn btn-success\" ng-disabled=\"!options.unsavedChangeCount\">{{ !options.unsavedChangeCount ? \"all saved\" : \"save changes (\" + options.unsavedChangeCount + \")\" }}</button>\n" +
    "\n" +
    "        <button ng-click=\"clear();\" type=\"button\" class=\"btn btn-info\">Clear</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ui-sortable=\"sortableOptions\" ng-model=\"widgets\" class=\"dashboard-widget-area\">\n" +
    "        <div ng-repeat=\"widget in widgets\" ng-style=\"widget.style\" class=\"widget-container\" widget>\n" +
    "            <div class=\"widget panel panel-default\">\n" +
    "                <div class=\"widget-header panel-heading\">\n" +
    "                    <h3 class=\"panel-title\">\n" +
    "                        <span class=\"widget-title\" ng-dblclick=\"editTitle(widget)\" ng-hide=\"widget.editingTitle\">{{widget.title}}</span>\n" +
    "                        <form action=\"\" class=\"widget-title\" ng-show=\"widget.editingTitle\" ng-submit=\"saveTitleEdit(widget)\">\n" +
    "                            <input type=\"text\" ng-model=\"widget.title\" class=\"form-control\">\n" +
    "                        </form>\n" +
    "                        <span class=\"label label-primary\" ng-if=\"!options.hideWidgetName\">{{widget.name}}</span>\n" +
    "                        <span ng-click=\"removeWidget(widget);\" class=\"glyphicon glyphicon-remove\" ng-if=\"!options.hideWidgetClose\"></span>\n" +
    "                        <span ng-click=\"openWidgetDialog(widget);\" class=\"glyphicon glyphicon-cog\" ng-if=\"!options.hideWidgetOptions\"></span>\n" +
    "                    </h3>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body widget-content\"></div>\n" +
    "                <div class=\"widget-ew-resizer\" ng-mousedown=\"grabResizer($event)\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

  $templateCache.put("template/widget-default-content.html",
    ""
  );

  $templateCache.put("template/widget-template.html",
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button>\n" +
    "  <h3>Widget Options <small>{{widget.title}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"form\" novalidate class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"widgetTitle\" class=\"col-sm-2 control-label\">Title</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"widgetTitle\" ng-model=\"result.title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-include=\"optionsTemplateUrl\"></div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "</div>"
  );

}]);
