import {ClassActivator} from 'aurelia-dependency-injection';
import {HtmlBehaviorResource} from 'aurelia-templating';
import {Dispatcher, DispatcherProxy} from './instance-dispatcher';
import {FluxDispatcher} from './flux-dispatcher';
import {Metadata} from './metadata';
import {Symbols} from './symbols';
import Promise from 'bluebird';

export class LifecycleManager {

    static interceptInstanceDeactivator(instance) {
        if(instance[Symbols.deactivators] === true) {
          return;
        }

        for(let deactivator of ['deactivate', 'detached']) {
          if(deactivator in instance && instance[Symbols.instanceDispatcher] !== undefined) {
              var deactivateImpl = instance[deactivator];
              instance[deactivator] = (...args) => {
                  FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
                  deactivateImpl.apply(instance, args);
              };
          } else {
              instance[deactivator] = () => {
                  FluxDispatcher.instance.unregisterInstanceDispatcher(instance[Symbols.instanceDispatcher]);
              };
          }
        }

        instance[Symbols.deactivators] = true;
    }

    static interceptHtmlBehaviorResource() {
      if(HtmlBehaviorResource === undefined || typeof HtmlBehaviorResource.prototype.analyze !== 'function') {
        throw new Error('Unsupported version of ClassActivator');
      }

      var analyzeImpl = HtmlBehaviorResource.prototype.analyze;

      HtmlBehaviorResource.prototype.analyze = function(...args) {
        let target = args[1];
        if(    target
            && target.prototype
            && target.prototype[Symbols.metadata]
            && target.prototype[Symbols.metadata].handlers
            && target.prototype[Symbols.metadata].handlers.size) {
          if(target.prototype.detached === undefined) {
            target.prototype.detached = function() {};
          }
        }
        return analyzeImpl.apply(this, args);
      };
    }

    static interceptClassActivator() {
        if(ClassActivator.instance === undefined || ClassActivator.instance.invoke === undefined) {
            throw new Error('Unsupported version of ClassActivator');
        }

        var invokeImpl = ClassActivator.instance.invoke;
        ClassActivator.instance.invoke = function(...invokeArgs) {
            var [type, args] = invokeArgs,
                instance,
                dispatcher = args.find((item) => { return item instanceof Dispatcher; });

            if(Array.isArray(args) === false) {
                throw new Error('Unsupported version of ClassActivator');
            }

            if(dispatcher) {
                var instancePromise = Promise.defer();
                args[args.indexOf(dispatcher)] = new DispatcherProxy(instancePromise.promise);
                instance = invokeImpl.apply(this, invokeArgs);
                instance[Symbols.instanceDispatcher] = new Dispatcher(instance);
                instancePromise.resolve(instance);
            } else {
                instance = invokeImpl.apply(this, invokeArgs);
            }

            if(Metadata.exists(Object.getPrototypeOf(instance))) {
                if(instance[Symbols.instanceDispatcher] === undefined || instance[Symbols.instanceDispatcher] instanceof Dispatcher === false) {
                    instance[Symbols.instanceDispatcher] = new Dispatcher(instance);
                }

                instance[Symbols.instanceDispatcher].registerMetadata();
            }

            if(instance[Symbols.instanceDispatcher] !== undefined) {
                LifecycleManager.interceptInstanceDeactivator(instance);
            }

            return instance;
        };
    }
}
