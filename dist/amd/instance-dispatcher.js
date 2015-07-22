define(['exports', './metadata', './utils', './flux-dispatcher', 'bluebird', './symbols'], function (exports, _metadata, _utils, _fluxDispatcher, _bluebird, _symbols) {
    'use strict';

    exports.__esModule = true;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _Promise = _interopRequireDefault(_bluebird);

    var Handler = function Handler(regexp, handler) {
        _classCallCheck(this, Handler);

        this.regexp = regexp;
        this['function'] = handler;
    };

    var Dispatcher = (function () {
        function Dispatcher(instance) {
            _classCallCheck(this, Dispatcher);

            this.instance = instance;
            this.handlers = new Set();

            _fluxDispatcher.FluxDispatcher.instance.registerInstanceDispatcher(this);
        }

        Dispatcher.prototype.handle = function handle(patterns, handlerImpl) {
            var _this = this;

            var handler = new Handler(_utils.Utils.patternsToRegex(patterns), handlerImpl);
            this.handlers.add(handler);

            return function () {
                _this.handlers['delete'](handler);
            };
        };

        Dispatcher.prototype.waitFor = function waitFor(types, handler) {
            _fluxDispatcher.FluxDispatcher.instance.waitFor(types, handler);
        };

        Dispatcher.prototype.dispatch = function dispatch(event, payload) {
            _fluxDispatcher.FluxDispatcher.instance.dispatch(event, payload);
        };

        Dispatcher.prototype.dispatchOwn = function dispatchOwn(event, payload) {
            var _this2 = this;

            var promises = [];

            this.handlers.forEach(function (handler) {
                if (handler.regexp.test(event)) {
                    promises.push(_Promise['default'].resolve(handler['function'].apply(_this2.instance, [event].concat(payload))));
                }
            });

            return _Promise['default'].settle(promises);
        };

        Dispatcher.prototype.registerMetadata = function registerMetadata() {
            var _this3 = this;

            var metadata = _metadata.Metadata.getOrCreateMetadata(Object.getPrototypeOf(this.instance));

            metadata.awaiters.forEach(function (types, methodName) {
                if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                    var methodImpl = _this3.instance[methodName];
                    _this3.instance[methodName] = function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        return _fluxDispatcher.FluxDispatcher.instance.waitFor(types, function () {
                            methodImpl.apply(_this3.instance, args);
                        });
                    };
                }
            });

            metadata.handlers.forEach(function (patterns, methodName) {
                if (_this3.instance[methodName] !== undefined && typeof _this3.instance[methodName] === 'function') {
                    _this3.handlers.add(new Handler(_utils.Utils.patternsToRegex(patterns), _this3.instance[methodName]));
                }
            });
        };

        return Dispatcher;
    })();

    exports.Dispatcher = Dispatcher;

    var DispatcherProxy = (function () {
        function DispatcherProxy(instancePromise) {
            var _this4 = this;

            _classCallCheck(this, DispatcherProxy);

            this.inititalize = _Promise['default'].resolve(instancePromise).then(function (instance) {
                _this4.instance = instance;
            });
        }

        DispatcherProxy.prototype.handle = function handle(patterns, handler) {
            var _this5 = this;

            this.inititalize.then(function () {
                _this5.instance[_symbols.Symbols.instanceDispatcher].handle(patterns, handler);
            });
        };

        DispatcherProxy.prototype.waitFor = function waitFor(types, handler) {
            var _this6 = this;

            this.inititalize.then(function () {
                _this6.instance[_symbols.Symbols.instanceDispatcher].waitFor(types, handler);
            });
        };

        DispatcherProxy.prototype.dispatch = function dispatch(event) {
            var _this7 = this;

            for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                payload[_key2 - 1] = arguments[_key2];
            }

            this.inititalize.then(function () {
                _this7.instance[_symbols.Symbols.instanceDispatcher].dispatch(event, payload);
            });
        };

        return DispatcherProxy;
    })();

    exports.DispatcherProxy = DispatcherProxy;
});