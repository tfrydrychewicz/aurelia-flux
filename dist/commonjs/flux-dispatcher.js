'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var FluxDispatcher = (function () {
    function FluxDispatcher() {
        _classCallCheck(this, FluxDispatcher);

        this.instanceDispatchers = new Map();
        this.isDispatching = false;
        this.queue = [];
        this.typesPromises = new Map();
    }

    FluxDispatcher.prototype.getOrCreateTypeDispatchers = function getOrCreateTypeDispatchers(type) {
        if (this.instanceDispatchers.has(type) === false) {
            this.instanceDispatchers.set(type, new Set());
        }

        return this.instanceDispatchers.get(type);
    };

    FluxDispatcher.prototype.getOrCreateTypePromises = function getOrCreateTypePromises(type) {
        if (this.typesPromises.has(type) === false) {
            this.typesPromises.set(type, _bluebird2['default'].defer());
        }

        return this.typesPromises.get(type);
    };

    FluxDispatcher.prototype.registerInstanceDispatcher = function registerInstanceDispatcher(dispatcher) {
        if (dispatcher === undefined || dispatcher.instance === undefined) {
            return;
        }

        var typeDispatchers = this.getOrCreateTypeDispatchers(Object.getPrototypeOf(dispatcher.instance));

        typeDispatchers.add(dispatcher);
    };

    FluxDispatcher.prototype.unregisterInstanceDispatcher = function unregisterInstanceDispatcher(dispatcher) {
        if (dispatcher === undefined || dispatcher.instance === undefined) {
            return;
        }

        var type = Object.getPrototypeOf(dispatcher.instance);

        if (this.instanceDispatchers.has(type) === false) {
            return;
        }

        this.instanceDispatchers.get(type)['delete'](dispatcher);

        if (this.instanceDispatchers.get(type).size === 0) {
            this.instanceDispatchers['delete'](type);
        }
    };

    FluxDispatcher.prototype.dispatch = function dispatch(event, payload) {
        this.$dispatch(event, payload, false);
    };

    FluxDispatcher.prototype.$dispatch = function $dispatch(event, payload, fromQueue) {
        var _this = this;

        if (this.isDispatching && fromQueue === false) {
            this.queue.push([event, payload]);
            return;
        }

        this.isDispatching = true;

        this.typesPromises = new Map();

        this.instanceDispatchers.forEach(function (dispatchers, type) {

            var typePromise = _this.getOrCreateTypePromises(type);
            var promises = [];

            dispatchers.forEach(function (dispatcher) {
                promises.push(dispatcher.dispatchOwn.apply(dispatcher, [event, payload]));
            });

            _bluebird2['default'].settle(promises).then(function () {
                typePromise.resolve();
            });
        });

        this.typesPromises.forEach(function (promise, type) {
            if (_this.instanceDispatchers.has(type) === false) {

                var _name = type !== undefined && type.constructor !== undefined && type.constructor.name !== undefined ? type.constructor.name : type.toString();
                console.warn('You are waiting for a type \'' + _name + '\' that didn\'t handle event \'' + event + '\'. ' + _name + ' promise has been resolved automatically.');

                promise.resolve();
            }
        });

        var allTypesPromises = Array.from(this.typesPromises.values()).map(function (defer) {
            return defer.promise;
        });

        _bluebird2['default'].settle(allTypesPromises).then(function () {
            var next = _this.queue.shift();
            setTimeout(function () {
                if (next !== undefined) {
                    _this.$dispatch(next[0], next[1], true);
                } else {
                    _this.isDispatching = false;
                }
            }, 0);
        });
    };

    FluxDispatcher.prototype.waitFor = function waitFor(types, handler) {
        var _this2 = this;

        if (Array.isArray(types) === false) {
            types = [types];
        }

        var typesPromises = types.map(function (type) {
            return _this2.getOrCreateTypePromises(type.prototype).promise;
        });

        _bluebird2['default'].settle(typesPromises).then(function () {
            handler();
        });
    };

    _createClass(FluxDispatcher, null, [{
        key: 'instance',
        value: new FluxDispatcher(),
        enumerable: true
    }]);

    return FluxDispatcher;
})();

exports.FluxDispatcher = FluxDispatcher;