/*jslint node: true*/
/*global angular*/
/*jslint plusplus: true */

'use strict';

/* Filters */

var filters = angular.module('app.filters', []);

var uniqueItems = function (data, key) {
    var result = [],
        i,
        value;
    for (i = 0; i < data.length; i++) {
        value = data[i][key];
        if (result.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
};

filters.filter('groupBy', function () {
    return function (collection, key) {
        if (collection === null) {
            return;
        }
        return uniqueItems(collection, key);
    };
});

filters.filter('groupFilter', function () {
    return function (collection, group) {
        var result = [],
            i;
        for (i = 0; i < collection.length; i++) {
            if (collection[i].group === group) {
                result.push(collection[i]);
            }
        }
        return result;
    };
})