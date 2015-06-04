define(['exports', 'aurelia-framework', './instance-dispatcher', './flux-dispatcher', './metadata', './symbols', 'bluebird'], function (exports, _aureliaFramework, _instanceDispatcher, _fluxDispatcher, _metadata, _symbols, _bluebird) {
    'use strict';

    exports.__esModule = true;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _Promise = _interopRequireDefault(_bluebird);

    var LifecycleManager = (function () {
        function LifecycleManager() {
            _classCallCheck(this, LifecycleManager);
        }

        LifecycleManager.interceptInstanceDeactivator = function interceptInstanceDeactivator(instance) {
            if ('deactivate' in instance && instance[_symbols.Symbols.instanceDispatcher] !== undefined) {
                var deactivateImpl = instance['deactivate'];
                instance['deactivate'] = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
                    deactivateImpl.apply(instance, args);
                };
            } else {
                instance['deactivate'] = function () {
                    _fluxDispatcher.FluxDispatcher.instance.unregisterInstanceDispatcher(instance[_symbols.Symbols.instanceDispatcher]);
                };
            }
        };

        LifecycleManager.interceptClassActivator = function interceptClassActivator() {
            if (_aureliaFramework.ClassActivator.instance === undefined || _aureliaFramework.ClassActivator.instance.invoke === undefined) {
                throw new Error('Unsupported version of ClassActivator');
            }

            var invokeImpl = _aureliaFramework.ClassActivator.instance.invoke;
            _aureliaFramework.ClassActivator.instance.invoke = function () {
                for (var _len2 = arguments.length, invokeArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    invokeArgs[_key2] = arguments[_key2];
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
                    var instancePromise = _Promise['default'].defer();
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
});