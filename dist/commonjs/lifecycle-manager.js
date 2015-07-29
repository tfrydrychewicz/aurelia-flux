'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _instanceDispatcher = require('./instance-dispatcher');

var _fluxDispatcher = require('./flux-dispatcher');

var _metadata = require('./metadata');

var _symbols = require('./symbols');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var LifecycleManager = (function () {
    function LifecycleManager() {
        _classCallCheck(this, LifecycleManager);
    }

    LifecycleManager.interceptInstanceDeactivator = function interceptInstanceDeactivator(instance) {
        if (instance[_symbols.Symbols.deactivators] === true) {
            return;
        }

        var _arr = ['deactivate', 'detached'];
        for (var _i = 0; _i < _arr.length; _i++) {
            var deactivator = _arr[_i];
            if (deactivator in instance && instance[_symbols.Symbols.instanceDispatcher] !== undefined) {
                var deactivateImpl = instance[deactivator];
                instance[deactivator] = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
                    deactivateImpl.apply(instance, args);
                };
            } else {
                instance[deactivator] = function () {
                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
                };
            }
        }

        instance[_symbols.Symbols.deactivators] = true;
    };

    LifecycleManager.interceptHtmlBehaviorResource = function interceptHtmlBehaviorResource() {
        if (_aureliaTemplating.HtmlBehaviorResource === undefined || typeof _aureliaTemplating.HtmlBehaviorResource.prototype.analyze !== 'function') {
            throw new Error('Unsupported version of ClassActivator');
        }

        var analyzeImpl = _aureliaTemplating.HtmlBehaviorResource.prototype.analyze;

        _aureliaTemplating.HtmlBehaviorResource.prototype.analyze = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var target = args[1];
            if (target && target.prototype && target.prototype[_symbols.Symbols.metadata] && target.prototype[_symbols.Symbols.metadata].handlers && target.prototype[_symbols.Symbols.metadata].handlers.size) {
                if (target.prototype.detached === undefined) {
                    target.prototype.detached = function () {};
                }
            }
            return analyzeImpl.apply(this, args);
        };
    };

    LifecycleManager.interceptClassActivator = function interceptClassActivator() {
        if (_aureliaDependencyInjection.ClassActivator.instance === undefined || _aureliaDependencyInjection.ClassActivator.instance.invoke === undefined) {
            throw new Error('Unsupported version of ClassActivator');
        }

        var invokeImpl = _aureliaDependencyInjection.ClassActivator.instance.invoke;
        _aureliaDependencyInjection.ClassActivator.instance.invoke = function () {
            for (var _len3 = arguments.length, invokeArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                invokeArgs[_key3] = arguments[_key3];
            }

            var type = invokeArgs[0];
            var args = invokeArgs[1];
            var instance;
            var dispatcher = args.find(function (item) {
                return item instanceof _instanceDispatcher.Dispatcher;
            });

            if (Array.isArray(args) === false) {
                throw new Error('Unsupported version of ClassActivator');
            }

            if (dispatcher) {
                var instancePromise = _bluebird2['default'].defer();
                args[args.indexOf(dispatcher)] = new _instanceDispatcher.DispatcherProxy(instancePromise.promise);
                instance = invokeImpl.apply(this, invokeArgs);
                instance[_symbols.Symbols.instanceDispatcher] = new _instanceDispatcher.Dispatcher(instance);
                instancePromise.resolve(instance);
            } else {
                instance = invokeImpl.apply(this, invokeArgs);
            }

            if (_metadata.Metadata.exists(Object.getPrototypeOf(instance))) {
                if (instance[_symbols.Symbols.instanceDispatcher] === undefined || instance[_symbols.Symbols.instanceDispatcher] instanceof _instanceDispatcher.Dispatcher === false) {
                    instance[_symbols.Symbols.instanceDispatcher] = new _instanceDispatcher.Dispatcher(instance);
                }

                instance[_symbols.Symbols.instanceDispatcher].registerMetadata();
            }

            if (instance[_symbols.Symbols.instanceDispatcher] !== undefined) {
                LifecycleManager.interceptInstanceDeactivator(instance);
            }

            return instance;
        };
    };

    return LifecycleManager;
})();

exports.LifecycleManager = LifecycleManager;