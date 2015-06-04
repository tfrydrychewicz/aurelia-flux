System.register(['aurelia-framework', './instance-dispatcher', './flux-dispatcher', './metadata', './symbols', 'bluebird'], function (_export) {
    'use strict';

    var ClassActivator, Dispatcher, DispatcherProxy, FluxDispatcher, Metadata, Symbols, Promise, LifecycleManager;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaFramework) {
            ClassActivator = _aureliaFramework.ClassActivator;
        }, function (_instanceDispatcher) {
            Dispatcher = _instanceDispatcher.Dispatcher;
            DispatcherProxy = _instanceDispatcher.DispatcherProxy;
        }, function (_fluxDispatcher) {
            FluxDispatcher = _fluxDispatcher.FluxDispatcher;
        }, function (_metadata) {
            Metadata = _metadata.Metadata;
        }, function (_symbols) {
            Symbols = _symbols.Symbols;
        }, function (_bluebird) {
            Promise = _bluebird['default'];
        }],
        execute: function () {
            LifecycleManager = (function () {
                function LifecycleManager() {
                    _classCallCheck(this, LifecycleManager);
                }

                LifecycleManager.interceptInstanceDeactivator = function interceptInstanceDeactivator(instance) {
                    if ('deactivate' in instance && instance[Symbols.instanceDispatcher] !== undefined) {
                        var deactivateImpl = instance['deactivate'];
                        instance['deactivate'] = function () {
                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                            }

                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                            deactivateImpl.apply(instance, args);
                        };
                    } else {
                        instance['deactivate'] = function () {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                        };
                    }
                };

                LifecycleManager.interceptClassActivator = function interceptClassActivator() {
                    if (ClassActivator.instance === undefined || ClassActivator.instance.invoke === undefined) {
                        throw new Error('Unsupported version of ClassActivator');
                    }

                    var invokeImpl = ClassActivator.instance.invoke;
                    ClassActivator.instance.invoke = function () {
                        for (var _len2 = arguments.length, invokeArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            invokeArgs[_key2] = arguments[_key2];
                        }

                        var type = invokeArgs[0];
                        var args = invokeArgs[1];
                        var instance;
                        var dispatcher = args.find(function (item) {
                            return item instanceof Dispatcher;
                        });

                        if (Array.isArray(args) === false) {
                            throw new Error('Unsupported version of ClassActivator');
                        }

                        if (dispatcher) {
                            var instancePromise = Promise.defer();
                            args[args.indexOf(dispatcher)] = new DispatcherProxy(instancePromise.promise);
                            instance = invokeImpl.apply(this, invokeArgs);
                            instance[Symbols.instanceDispatcher] = new Dispatcher(instance);
                            instancePromise.resolve(instance);
                        } else {
                            instance = invokeImpl.apply(this, invokeArgs);
                        }

                        if (Metadata.exists(Object.getPrototypeOf(instance))) {
                            if (instance[Symbols.instanceDispatcher] === undefined || instance[Symbols.instanceDispatcher] instanceof Dispatcher === false) {
                                instance[Symbols.instanceDispatcher] = new Dispatcher(instance);
                            }

                            instance[Symbols.instanceDispatcher].registerMetadata();
                        }

                        if (instance[Symbols.instanceDispatcher] !== undefined) {
                            LifecycleManager.interceptInstanceDeactivator(instance);
                        }

                        return instance;
                    };
                };

                return LifecycleManager;
            })();

            _export('LifecycleManager', LifecycleManager);
        }
    };
});