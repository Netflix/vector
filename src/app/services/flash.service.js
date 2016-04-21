/* global angular */

(function () {
    'use strict';

    var subscriberCount = 0;

    var Flash = function (options) {
        var _options = angular.extend({
            id: null,
            subscribers: {},
            classnames: {
                error: [],
                warn: [],
                info: [],
                success: []
            }
        }, options);

        var _self = this;
        var _success;
        var _info;
        var _warn;
        var _error;
        var _type;

        function _notify(type, message) {
            angular.forEach(_options.subscribers, function (subscriber) {
                var matchesType = !subscriber.type || subscriber.type === type;
                var matchesId = (!_options.id && !subscriber.id) || subscriber.id === _options.id;
                if (matchesType && matchesId) {
                    subscriber.cb(message, type);
                }
            });
        }

        this.clean = function () {
            _success = null;
            _info = null;
            _warn = null;
            _error = null;
            _type = null;
        };

        this.subscribe = function (subscriber, type, id) {
            subscriberCount += 1;
            _options.subscribers[subscriberCount] = {
                cb: subscriber,
                type: type,
                id: id
            };
            return subscriberCount;
        };

        this.unsubscribe = function (handle) {
            delete _options.subscribers[handle];
        };

        this.to = function (id) {
            var options = angular.copy(_options);
            options.id = id;
            return new Flash(options);
        };

        Object.defineProperty(this, 'success', {
            get: function () {
                return _success;
            },
            set: function (message) {
                _success = message;
                _type = 'success';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'info', {
            get: function () {
                return _info;
            },
            set: function (message) {
                _info = message;
                _type = 'info';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'warn', {
            get: function () {
                return _warn;
            },
            set: function (message) {
                _warn = message;
                _type = 'warn';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'error', {
            get: function () {
                return _error;
            },
            set: function (message) {
                _error = message;
                _type = 'error';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'type', {
            get: function () {
                return _type;
            }
        });

        Object.defineProperty(this, 'message', {
            get: function () {
                return _type ? _self[_type] : null;
            }
        });

        Object.defineProperty(this, 'classnames', {
            get: function () {
                return _options.classnames;
            }
        });

        Object.defineProperty(this, 'id', {
            get: function () {
                return _options.id;
            }
        });
    };

    angular.module('angular-flash.service', [])
        .provider('flash', function () {
            var _self = this;
            this.errorClassnames = ['alert-error'];
            this.warnClassnames = ['alert-warn'];
            this.infoClassnames = ['alert-info'];
            this.successClassnames = ['alert-success'];

            this.$get = function () {
                return new Flash({
                    classnames: {
                        error: _self.errorClassnames,
                        warn: _self.warnClassnames,
                        info: _self.infoClassnames,
                        success: _self.successClassnames
                    }
                });
            };
        });

}());
