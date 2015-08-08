import {LifecycleManager} from '../src/lifecycle-manager';
import {ClassActivator} from 'aurelia-dependency-injection';
import {FluxDispatcher} from '../src/flux-dispatcher';
import {Symbols} from '../src/symbols';
import {HtmlBehaviorResource} from 'aurelia-templating';
import {Dispatcher, DispatcherProxy} from '../src/instance-dispatcher';
import {Metadata} from '../src/metadata';

describe('Lifecycle Manager', () => {
    describe('interceptInstanceDeactivate', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        describe('without instance.deactivate', () => {
            it('adds new deactivate method', () => {
                expect(instance.deactivate).toBeUndefined();
                LifecycleManager.interceptInstanceDeactivate(instance);
                expect(instance.deactivate).toBeDefined();
            });

            describe('intercepted deactivate method', () => {
                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });

        describe('with instance.deactivate', () => {
            it('intercepts deactivate method', () => {
                var deactivate = function () { };
                instance.deactivate = deactivate;
                LifecycleManager.interceptInstanceDeactivate(instance);
                expect(instance.deactivate).toBeDefined();
                expect(instance.deactivate).not.toBe(deactivate);
            });

            describe('intercepted deactivate method', () => {
                it('runs original deactivate method', () => {
                    var deactivate = jasmine.createSpy('deactivate');
                    instance.deactivate = deactivate;
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(deactivate).toHaveBeenCalled();
                });

                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    var deactivate = function () { };
                    instance.deactivate = deactivate;
                    LifecycleManager.interceptInstanceDeactivate(instance);
                    instance.deactivate();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });
    });


    describe('interceptInstanceDetached', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        describe('without instance.detached', () => {
            it('adds new detached method', () => {
                expect(instance.detached).toBeUndefined();
                LifecycleManager.interceptInstanceDetached(instance);
                expect(instance.detached).toBeDefined();
            });

            describe('intercepted detached method', () => {
                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });

        describe('with instance.detached', () => {
            it('intercepts detached method', () => {
                var detached = function () { };
                instance.detached = detached;
                LifecycleManager.interceptInstanceDetached(instance);
                expect(instance.detached).toBeDefined();
                expect(instance.detached).not.toBe(detached);
            });

            describe('intercepted detached method', () => {
                it('runs original detached method', () => {
                    var detached = jasmine.createSpy('detached');
                    instance.detached = detached;
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(detached).toHaveBeenCalled();
                });

                it('runs FluxDispatcher', () => {
                    spyOn(FluxDispatcher.instance, 'unregisterInstanceDispatcher');
                    var detached = function () { };
                    instance.detached = detached;
                    LifecycleManager.interceptInstanceDetached(instance);
                    instance.detached();
                    expect(FluxDispatcher.instance.unregisterInstanceDispatcher).toHaveBeenCalled();
                });
            });
        });
    });


    describe('interceptInstanceDeactivators', () => {

        var instance;

        beforeEach(() => {
            instance = {};
        });

        it('sets Symbols.deactivators on an instance when invoked', () => {
            expect(instance[Symbols.deactivators]).toBeUndefined();
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(instance[Symbols.deactivators]).toBeDefined();
        });

        it('runs LifecycleManager.interceptInstanceDeactivate', () => {
            spyOn(LifecycleManager, 'interceptInstanceDeactivate');
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDeactivate).toHaveBeenCalledWith(instance);
        });

        it('runs LifecycleManager.interceptInstanceDeactivate only once', () => {
            spyOn(LifecycleManager, 'interceptInstanceDeactivate');
            LifecycleManager.interceptInstanceDeactivators(instance);
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDeactivate.calls.count()).toEqual(1);
        });

        it('runs LifecycleManager.interceptInstanceDetached', () => {
            spyOn(LifecycleManager, 'interceptInstanceDetached');
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDetached).toHaveBeenCalledWith(instance);
        });

        it('runs LifecycleManager.interceptInstanceDetached only once', () => {
            spyOn(LifecycleManager, 'interceptInstanceDetached');
            LifecycleManager.interceptInstanceDeactivators(instance);
            LifecycleManager.interceptInstanceDeactivators(instance);
            expect(LifecycleManager.interceptInstanceDetached.calls.count()).toEqual(1);
        });
    });


    describe('interceptHtmlBehaviorResource', () => {

        describe('intercepted analyze method', () => {

            it('runs original method', () => {
                var analyze = jasmine.createSpy('analyze');
                HtmlBehaviorResource.prototype.analyze = analyze;
                LifecycleManager.interceptHtmlBehaviorResource();
                expect(HtmlBehaviorResource.prototype.analyze).not.toBe(analyze);

                function target() { };

                HtmlBehaviorResource.prototype.analyze(1, target, false);
                expect(analyze).toHaveBeenCalledWith(1, target, false);
            });

            it('adds detached method to a target with flux metadata', () => {
                function target() { }

                target.prototype[Symbols.metadata] = {
                    handlers: {
                        size: 123
                    }
                };

                expect(target.prototype.detached).toBeUndefined();
                HtmlBehaviorResource.prototype.analyze = function () { };
                LifecycleManager.interceptHtmlBehaviorResource();
                HtmlBehaviorResource.prototype.analyze(null, target);
                expect(target.prototype.detached).toBeDefined();
            });

            it('doesn\'t add detached method to a target without flux metadata', () => {
                function target() { }

                expect(target.prototype.detached).toBeUndefined();
                HtmlBehaviorResource.prototype.analyze = function () { };
                LifecycleManager.interceptHtmlBehaviorResource();
                HtmlBehaviorResource.prototype.analyze(null, target);
                expect(target.prototype.detached).toBeUndefined();
            });

        });
    });

    describe('interceptClassActivator', () => {

        var invokeImpl,
            instance,
            origInstanceProto,
            instanceProto;
                
        beforeAll(() => {            
            instanceProto = {};            
        });                         
                 
        beforeEach(() => {
            instance = Object.create(instanceProto);
            invokeImpl = jasmine.createSpy('invoke').and.returnValue(instance);
            ClassActivator.instance.invoke = invokeImpl;
        });

        it('intercepts ClassActivator.instance.invoke', () => {
            LifecycleManager.interceptClassActivator();
            expect(ClassActivator.instance.invoke).not.toBe(invokeImpl);
        });

        describe('intercepted ClassActivator.instance.invoke', () => {         
                       
            it('throws an exception when second argument is not an array', () => {
                LifecycleManager.interceptClassActivator();
                expect(() => ClassActivator.instance.invoke(null, "")).toThrowError('Unsupported version of ClassActivator');
            });                     
                           
            // without dispatcher injected
            describe('without dispatcher injected', () => {
                it('runs original invoke method', () => {
                    LifecycleManager.interceptClassActivator();
                    ClassActivator.instance.invoke(null, []);
                    expect(invokeImpl).toHaveBeenCalled();
                });

                it('returns proper instance', () => {
                    LifecycleManager.interceptClassActivator();
                    var result = ClassActivator.instance.invoke(null, []);
                    expect(result).toBe(instance);
                });
            });
            ///////////////////////////////
            
            // with dispatcher injected
            describe('with dispatcher injected', () => {

                var dispatcher;

                beforeEach(() => {
                    dispatcher = new Dispatcher();
                });

                it('runs original invoke method', () => {
                    LifecycleManager.interceptClassActivator();
                    ClassActivator.instance.invoke(null, [dispatcher]);
                    expect(invokeImpl).toHaveBeenCalled();
                });

                it('returns proper instance', () => {
                    LifecycleManager.interceptClassActivator();
                    var result = ClassActivator.instance.invoke(null, [dispatcher]);
                    expect(result).toBe(instance);
                });

                it('replaces injected Dispatcher with DispatcherProxy', (done) => {
                    LifecycleManager.interceptClassActivator();
                    var args = [dispatcher];
                    ClassActivator.instance.invoke(null, args);
                    expect(args[0] instanceof DispatcherProxy).toBe(true);
                    args[0].inititalize.then(() => {
                        expect(args[0].instance).toBe(instance);
                        done();
                    }, done.fail);
                });

                it('sets instance[Symbols.instanceDispatcher] to be new Dispatcher', () => {
                    LifecycleManager.interceptClassActivator();
                    expect(instance[Symbols.instanceDispatcher]).toBeUndefined();
                    ClassActivator.instance.invoke(null, [dispatcher]);
                    expect(instance[Symbols.instanceDispatcher]).toBeDefined();
                });
                
                it('intercepts instance deactivators', () => {
                     spyOn(LifecycleManager, 'interceptInstanceDeactivators');
                     LifecycleManager.interceptClassActivator();
                     ClassActivator.instance.invoke(null, [dispatcher]);
                     expect(LifecycleManager.interceptInstanceDeactivators).toHaveBeenCalledWith(instance);
                 });
            });              
            ///////////////////////////////
           
            describe('for instance prototype with metadata', () => {                                 
                
                 beforeEach(() => {
                    instanceProto[Symbols.metadata] = new Metadata();
                 });
                 
                 it('runs instance Disptacher.registerMetadata', () => {
                     spyOn(Dispatcher.prototype, 'registerMetadata');
                     LifecycleManager.interceptClassActivator();                     
                     ClassActivator.instance.invoke(null, []);
                     expect(Dispatcher.prototype.registerMetadata).toHaveBeenCalled();
                 });
                 
                 it('intercepts instance deactivators', () => {
                     spyOn(LifecycleManager, 'interceptInstanceDeactivators');
                     LifecycleManager.interceptClassActivator();
                     ClassActivator.instance.invoke(null, []);
                     expect(LifecycleManager.interceptInstanceDeactivators).toHaveBeenCalledWith(instance);
                 });                                  
            });
                      
        });
    });
});
