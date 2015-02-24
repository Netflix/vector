/*jslint node: true*/
/*jslint todo: true */
/*global d3, angular*/

'use strict';

/* Directives */

var directives = angular.module('app.directives', []);

directives.directive('lineTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/line-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('lineIntegerTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/line-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisIntegerTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('linePercentageTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/line-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisPercentageTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('linePercentageForceYTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/line-forcey-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisPercentageTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('lineIntegerForceYTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/line-integer-forcey-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisIntegerTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('areaStackedTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/area-stacked-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('areaStackedIntegerTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/area-stacked-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisIntegerTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('areaStackedPercentageTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/area-stacked-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisPercentageTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('areaStackedPercentageForceYTimeSeries', function (D3Service) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/area-stacked-forcey-timeseries.html',
        scope: {
            data: '='
        },
        link: function (scope) {
            scope.yAxisTickFormat = D3Service.yAxisPercentageTickFormat;
            scope.xAxisTickFormat = D3Service.xAxisTickFormat;
            scope.yFunction = D3Service.yFunction;
            scope.xFunction = D3Service.xFunction;
            scope.id = D3Service.getId();
        }
    };
});

directives.directive('ngDelay', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: true,
        compile: function (element, attributes) {
            var expression = attributes['ngChange'];
            if (!expression)
                return;

            var ngModel = attributes['ngModel'];
            if (ngModel) attributes['ngModel'] = '$parent.' + ngModel;
            attributes['ngChange'] = '$$delay.execute()';

            return {
                post: function (scope, element, attributes) {
                    scope.$$delay = {
                        expression: expression,
                        delay: scope.$eval(attributes['ngDelay']),
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
            }
        }
    };
}]);


directives.directive('cpuFlameGraph', function ($rootScope, $timeout, FlameGraphService, VectorService) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/cpu-flame-graph.html',
        link: function (scope) {
            scope.host = $rootScope.properties.host;
            scope.port = $rootScope.properties.port
            scope.context = $rootScope.properties.context;
            scope.ready = false;
            scope.processing = false;
            scope.id = VectorService.getGuid();
            scope.generateFlameGraph = function(){
                FlameGraphService.generate();
                scope.ready = true;
                scope.processing = true;
                $timeout(function () {
                    scope.processing = false;
                }, 65000)
            }
        }
    };
});

directives.directive('diskLatencyHeatMap', function ($rootScope, $timeout, HeatMapService, VectorService) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/disk-latency-graph.html',
        link: function (scope) {
            scope.host = $rootScope.properties.host;
            scope.port = $rootScope.properties.port
            scope.context = $rootScope.properties.context;
            scope.ready = false;
            scope.processing = false;
            scope.id = VectorService.getGuid();
            scope.generateHeatMap = function(){
                HeatMapService.generate();
                scope.ready = true;
                scope.processing = true;
                $timeout(function () {
                    scope.processing = false;
                }, 150000)
            }
        }
    };
});