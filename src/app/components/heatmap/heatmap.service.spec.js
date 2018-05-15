'use strict';

/* eslint-disable angular/definedundefined */

// polyfill required for PhantomJS
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function(value) {

        // Steps 1-2.
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        var O = Object(this);

        // Steps 3-5.
        var len = O.length >>> 0;

        // Steps 6-7.
        var start = arguments[1];
        var relativeStart = start >> 0;

        // Step 8.
        var k = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) :
            Math.min(relativeStart, len);

        // Steps 9-10.
        var end = arguments[2];
        var relativeEnd = end === undefined ?
            len : end >> 0;

        // Step 11.
        var final = relativeEnd < 0 ?
            Math.max(len + relativeEnd, 0) :
            Math.min(relativeEnd, len);

        // Step 12.
        while (k < final) {
            O[k] = value;
            k++;
        }

        // Step 13.
        return O;
        }
    });
}

describe('Service: Heatmap', function() {

    beforeEach(module('heatmap'));

    var $rootScope, HeatmapService;

    beforeEach(inject(function(_$rootScope_, _HeatmapService_){
        $rootScope = _$rootScope_;
        HeatmapService = _HeatmapService_;
    }));

    it('should parse heatmap data', function() {
        $rootScope.properties = {
            interval: 2,
            window: 8/60
        };

        var rawData = [
            {"key":"0-1","values":[
                {"x":1525791275151.992,"y":2},
                {"x":1525791275152.992,"y":3},
                {"x":1525791277175.622,"y":4},
                {"x":1525791279159.262,"y":5}
            ]},
            {"key":"2-3","values":[
                {"x":1525791275151.992,"y":6},
                {"x":1525791275152.992,"y":7},
                {"x":1525791277175.622,"y":8},
                {"x":1525791279159.262,"y":9}
            ]},
            {"key":"4-7","values":[
                {"x":1525791275151.992,"y":10},
                {"x":1525791275152.992,"y":11},
                {"x":1525791277175.622,"y":12},
                {"x":1525791279159.262,"y":13}
            ]}
        ];

        var hmData = HeatmapService.generate(rawData, 7);
        expect(hmData.rows).toEqual([Infinity, 7, 3, 1]);
        expect(hmData.columns).toEqual([1525791273, 1525791275, 1525791277, 1525791279]);
        expect(hmData.values).toEqual([
            [null, null, null, null],
            [null, 11*2, 7*2, 3*2],
            [null, 12*2, 8*2, 4*2],
            [null, 13*2, 9*2, 5*2]
        ]);
    });

    it('should merge rows gt than maxRow to infinity row', function() {
        $rootScope.properties = {
            interval: 2,
            window: 4/60
        };

        var rawData = [
            {"key":"0-1","values":[
                {"x":1525791281157.147,"y":2},
                {"x":1525791283163.355,"y":3}
            ]},
            {"key":"2-3","values":[
                {"x":1525791281157.147,"y":4},
                {"x":1525791283163.355,"y":5}
            ]},
            {"key":"4-7","values":[ // infinity bucket
                {"x":1525791281157.147,"y":6},
                {"x":1525791283163.355,"y":7}
            ]},
            {"key":"8-15","values":[ // infinity bucket
                {"x":1525791281157.147,"y":8},
                {"x":1525791283163.355,"y":9}
            ]}
        ];

        var hmData = HeatmapService.generate(rawData, 6);
        expect(hmData.rows).toEqual([Infinity, 3, 1]);
        expect(hmData.columns).toEqual([1525791281, 1525791283]);
        expect(hmData.values).toEqual([
            [6*2+8*2, 4*2, 2*2],
            [7*2+9*2, 5*2, 3*2]
        ]);
    });

    it('should parse heatmap data with updated interval', function() {
        $rootScope.properties = {
            interval: 4,
            window: 14/60
        };

        var rawData = [
            {"key":"0-1","values":[
                {"x":1525791277175.622,"y":2},
                {"x":1525791279159.262,"y":3},
                {"x":1525791281157.147,"y":4},
                {"x":1525791283163.355,"y":5}
            ]},
            {"key":"2-3","values":[
                {"x":1525791277175.622,"y":6},
                {"x":1525791279159.262,"y":7},
                {"x":1525791281157.147,"y":8},
                {"x":1525791283163.355,"y":9}
            ]}
        ];

        var hmData = HeatmapService.generate(rawData, 3);
        expect(hmData.rows).toEqual([Infinity, 3, 1]);
        expect(hmData.columns).toEqual([1525791271, 1525791275, 1525791279, 1525791283]);
        expect(hmData.values).toEqual([
            [null, null, null],
            [null, null, null],
            [null, 7*4, 3*4],
            [null, 9*4, 5*4]
        ]);
    });

});