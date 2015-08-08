System.register(['aurelia-dependency-injection', 'aurelia-templating', './instance-dispatcher', './flux-dispatcher', './metadata', './symbols', 'bluebird', 'aurelia-router'], function (_export) {
    'use strict';

    var ClassActivator, HtmlBehaviorResource, Dispatcher, DispatcherProxy, FluxDispatcher, Metadata, Symbols, Promise, activationStrategy, LifecycleManager;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaDependencyInjection) {
            ClassActivator = _aureliaDependencyInjection.ClassActivator;
        }, function (_aureliaTemplating) {
            HtmlBehaviorResource = _aureliaTemplating.HtmlBehaviorResource;
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
        }, function (_aureliaRouter) {
            activationStrategy = _aureliaRouter.activationStrategy;
        }],
        execute: function () {
            LifecycleManager = (function () {
                function LifecycleManager() {
                    _classCallCheck(this, LifecycleManager);
                }

                LifecycleManager.interceptInstanceDeactivators = function interceptInstanceDeactivators(instance) {
                    if (instance[Symbols.deactivators] === true) {
                        return;
                    }

                    LifecycleManager.interceptInstanceDeactivate(instance);
                    LifecycleManager.interceptInstanceDetached(instance);

                    instance[Symbols.deactivators] = true;
                };

                LifecycleManager.interceptInstanceDeactivate = function interceptInstanceDeactivate(instance) {

                    function _unregister() {
                        if (FluxDispatcher.instance.strategy !== activationStrategy.invokeLifecycle) {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                        }
                    }

                    if (instance.deactivate !== undefined) {
                        var deactivateImpl = instance.deactivate;
                        instance.deactivate = function () {
                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                            }

                            _unregister();
                            deactivateImpl.apply(instance, args);
                        };
                    } else {
                        instance.deactivate = function () {
                            _unregister();
                        };
                    }
                };

                LifecycleManager.interceptInstanceDetached = function interceptInstanceDetached(instance) {
                    if (instance.detached !== undefined) {
                        var deactivateImpl = instance.detached;
                        instance.detached = function () {
                            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                args[_key2] = arguments[_key2];
                            }

                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                            deactivateImpl.apply(instance, args);
                        };
                    } else {
                        instance.detached = function () {
                            FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                        };
                    }
                };

                LifecycleManager.interceptHtmlBehaviorResource = function interceptHtmlBehaviorResource() {
                    if (HtmlBehaviorResource === undefined || typeof HtmlBehaviorResource.prototype.analyze !== 'function') {
                        throw new Error('Unsupported version of HtmlBehaviorResource');
                    }

                    var analyzeImpl = HtmlBehaviorResource.prototype.analyze;

                    HtmlBehaviorResource.prototype.analyze = function () {
                        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                            args[_key3] = arguments[_key3];
                        }

                        var target = args[1];
                        if (target && target.prototype && target.prototype[Symbols.metadata] && target.prototype[Symbols.metadata].handlers && target.prototype[Symbols.metadata].handlers.size) {
                            if (target.prototype.detached === undefined) {
                                target.prototype.detached = function () {};
                            }
                        }
                        return analyzeImpl.apply(this, args);
                    };
                };

                LifecycleManager.interceptClassActivator = function interceptClassActivator() {
                    if (ClassActivator.instance === undefined || ClassActivator.instance.invoke === undefined) {
                        throw new Error('Unsupported version of ClassActivator');
                    }

                    var invokeImpl = ClassActivator.instance.invoke;
                    ClassActivator.instance.invoke = function () {
                        for (var _len4 = arguments.length, invokeArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                            invokeArgs[_key4] = arguments[_key4];
                        }

                        var args = invokeArgs[1],
                            instance;

                        if (Array.isArray(args) === false) {
                            throw new Error('Unsupported version of ClassActivator');
                        }

                        var dispatcher = args.find(function (item) {
                            return item instanceof Dispatcher;
                        });

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
                            if (instance[Symbols.instanceDispatcher] === undefined) {
                                instance[Symbols.instanceDispatcher] = new Dispatcher(instance);
                            }
                            instance[Symbols.instanceDispatcher].registerMetadata();
                        }

                        if (instance[Symbols.instanceDispatcher] !== undefined) {
                            LifecycleManager.interceptInstanceDeactivators(instance);
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