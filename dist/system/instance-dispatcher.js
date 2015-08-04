System.register(['./metadata', './utils', './flux-dispatcher', 'bluebird', './symbols'], function (_export) {
    'use strict';

    var Metadata, Utils, FluxDispatcher, Promise, Symbols, Handler, Dispatcher, DispatcherProxy;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_metadata) {
            Metadata = _metadata.Metadata;
        }, function (_utils) {
            Utils = _utils.Utils;
        }, function (_fluxDispatcher) {
            FluxDispatcher = _fluxDispatcher.FluxDispatcher;
        }, function (_bluebird) {
            Promise = _bluebird['default'];
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }],
        execute: function () {
            Handler = function Handler(regexp, handler) {
                _classCallCheck(this, Handler);

                this.regexp = regexp;
                this['function'] = handler;
            };

            Dispatcher = (function () {
                function Dispatcher(instance) {
                    _classCallCheck(this, Dispatcher);

                    this.instance = instance;
                    this.handlers = new Set();

                    FluxDispatcher.instance.registerInstanceDispatcher(this);
                }

                Dispatcher.prototype.handle = function handle(patterns, callback) {
                    var _this = this;

                    var handler = new Handler(Utils.patternsToRegex(patterns), callback);
                    this.handlers.add(handler);

                    return function () {
                        _this.handlers['delete'](handler);
                    };
                };

                Dispatcher.prototype.waitFor = function waitFor(types, handler) {
                    FluxDispatcher.instance.waitFor(types, handler);
                };

                Dispatcher.prototype.dispatch = function dispatch(action) {
                    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        payload[_key - 1] = arguments[_key];
                    }

                    FluxDispatcher.instance.dispatch(action, payload);
                };

                Dispatcher.prototype.dispatchOwn = function dispatchOwn(action, payload) {
                    var _this2 = this;

                    var promises = [];

                    this.handlers.forEach(function (handler) {
                        if (handler.regexp.test(action)) {
                            promises.push(Promise.resolve(handler['function'].apply(_this2.instance, [action].concat(payload))));
                        }
                    });

                    return Promise.settle(promises);
                };

                Dispatcher.prototype.registerMetadata = function registerMetadata() {
                    var _this3 = this;

                    var metadata = Metadata.getOrCreateMetadata(Object.getPrototypeOf(this.instance));

                    metadata.awaiters.forEach(function (types, methodName) {
                        if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                            var methodImpl = _this3.instance[methodName];
                            _this3.instance[methodName] = function () {
                                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                    args[_key2] = arguments[_key2];
                                }

                                return FluxDispatcher.instance.waitFor(types, function () {
                                    methodImpl.apply(_this3.instance, args);
                                });
                            };
                        }
                    });

                    metadata.handlers.forEach(function (patterns, methodName) {
                        if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                            _this3.handlers.add(new Handler(Utils.patternsToRegex(patterns), _this3.instance[methodName]));
                        }
                    });
                };

                return Dispatcher;
            })();

            _export('Dispatcher', Dispatcher);

            DispatcherProxy = (function () {
                function DispatcherProxy(instancePromise) {
                    var _this4 = this;

                    _classCallCheck(this, DispatcherProxy);

                    this.inititalize = Promise.resolve(instancePromise).then(function (instance) {
                        _this4.instance = instance;
                    });
                }

                DispatcherProxy.prototype.handle = function handle(patterns, handler) {
                    var _this5 = this;

                    var def = Promise.defer();

                    this.inititalize.then(function () {
                        def.resolve(_this5.instance[Symbols.instanceDispatcher].handle(patterns, handler));
                    });

                    return function () {
                        def.promise.then(function (unregister) {
                            return unregister();
                        });
                    };
                };

                DispatcherProxy.prototype.waitFor = function waitFor(types, handler) {
                    var _this6 = this;

                    this.inititalize.then(function () {
                        _this6.instance[Symbols.instanceDispatcher].waitFor(types, handler);
                    });
                };

                DispatcherProxy.prototype.dispatch = function dispatch(action) {
                    var _this7 = this;

                    for (var _len3 = arguments.length, payload = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                        payload[_key3 - 1] = arguments[_key3];
                    }

                    this.inititalize.then(function () {
                        _this7.instance[Symbols.instanceDispatcher].dispatch.apply(_this7.instance[Symbols.instanceDispatcher], [action].concat(payload));
                    });
                };

                return DispatcherProxy;
            })();

            _export('DispatcherProxy', DispatcherProxy);
        }
    };
});