import {Dispatcher} from './dispatcher';
import {Flux} from './flux';
import {ClassActivator} from 'aurelia-framework';

export function setupInterceptor() {

  if(ClassActivator.instance === undefined || ClassActivator.instance.invoke === undefined) {
    throw new Error('Unsupported version of ClassActivator');
  }

  var invokeImpl = ClassActivator.instance.invoke;
  ClassActivator.instance.invoke = (...invokeArgs) => {
    var [fn, args] = invokeArgs,
        instance = invokeImpl.apply(invokeImpl, invokeArgs),
        dispatcher = args.find((item, i) => { return item instanceof Dispatcher; });

    if(dispatcher) {
      dispatcher.setInstance(instance);
      Flux.getMetadata(Object.getPrototypeOf(instance));
    }

    return instance;
  };
}
