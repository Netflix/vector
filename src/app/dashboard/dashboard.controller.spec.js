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

/*jslint devel: true */

/* Controller Tests */

describe('DashboardCtrl', function () {
    'use strict';

    beforeEach(module('app', function ($provide) {
        // Output messages
        $provide.value('$log', console);
    }));

    var $controller, $rootScope, $log, DashboardService;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$log_, _DashboardService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $log = _$log_;
        DashboardService = _DashboardService_;
    }));

    it('should not be null', function () {
        var $scope, route, routeParams, widgetDefinitions, widgets, controller;

        $scope = $rootScope.$new();
        route = {
            current: {
                $$route: {
                    originalPath: '/empty'
                }
            }
        };
        routeParams = {
            host: null
        };
        widgetDefinitions = [];
        widgets = [];
        controller = $controller('DashboardCtrl', {
            $scope: $scope,
            $rootScope: $rootScope,
            $log: $log,
            $route: route,
            $routeParams: routeParams,
            widgetDefinitions: widgetDefinitions,
            defaultWidgets: widgets,
            emptyWidgets: widgets,
            DashboardService: DashboardService
        });

        expect(controller).toNotBe(null);
    });

    it('should initialize properties', function () {
        var $scope, route, routeParams, widgetDefinitions, widgets, controller;

        $scope = $rootScope.$new();
        route = {
            current: {
                $$route: {
                    originalPath: '/empty'
                }
            }
        };
        routeParams = {
            host: null
        };
        widgetDefinitions = [];
        widgets = [];
        controller = $controller('DashboardCtrl', {
            $scope: $scope,
            $rootScope: $rootScope,
            $log: $log,
            $route: route,
            $routeParams: routeParams,
            widgetDefinitions: widgetDefinitions,
            defaultWidgets: widgets,
            emptyWidgets: widgets,
            DashboardService: DashboardService
        });

        expect($scope.properties.host).toEqual('');
    });

});
