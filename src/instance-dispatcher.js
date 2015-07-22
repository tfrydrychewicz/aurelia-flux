import {Metadata} from './metadata';
import {Utils} from './utils';
import {FluxDispatcher} from './flux-dispatcher';
import Promise from 'bluebird';
import {Symbols} from './symbols';

class Handler {
    constructor(regexp, handler) {
        this.regexp = regexp;
        this.function = handler;
    }
}

export class Dispatcher {

    constructor(instance) {
        this.instance = instance;
        this.handlers = new Set();

        FluxDispatcher.instance.registerInstanceDispatcher(this);
    }

    handle(patterns, handlerImpl) {
        var handler = new Handler(Utils.patternsToRegex(patterns), handlerImpl)
        this.handlers.add(handler);

        return () => {
            this.handlers.delete(handler);
        };
    }

    waitFor(types, handler) {
        FluxDispatcher.instance.waitFor(types, handler);
    }

    dispatch(event, payload) {
        FluxDispatcher.instance.dispatch(event, payload);
    }

    dispatchOwn(event, payload) {

        var promises = [];

        this.handlers.forEach((handler) => {
            if(handler.regexp.test(event)) {
                promises.push(Promise.resolve(handler.function.apply(this.instance, [event].concat(payload))));
            }
        });

        return Promise.settle(promises);
    }

    registerMetadata() {
        var metadata = Metadata.getOrCreateMetadata(Object.getPrototypeOf(this.instance));

        metadata.awaiters.forEach((types, methodName) => {
            if(this.instance[methodName] !== undefined && typeof this.instance[methodName] === 'function') {
                var methodImpl = this.instance[methodName];
                this.instance[methodName] = (...args) => {
                    return FluxDispatcher.instance.waitFor(types, () => {
                        methodImpl.apply(this.instance, args);
                    });
                };
            }
        });

        metadata.handlers.forEach((patterns, methodName) => {
            if(this.instance[methodName] !== undefined && typeof this.instance[methodName] === 'function') {
                this.handlers.add(new Handler(Utils.patternsToRegex(patterns), this.instance[methodName]));
            }
        });
    }
}

export class DispatcherProxy {

    constructor(instancePromise) {
        this.inititalize = Promise.resolve(instancePromise).then((instance) => {
            this.instance = instance;
        });
    }


    handle(patterns, handler) {
        this.inititalize.then(() => {
            this.instance[Symbols.instanceDispatcher].handle(patterns, handler);
        });
    }

    waitFor(types, handler) {
        this.inititalize.then(() => {
            this.instance[Symbols.instanceDispatcher].waitFor(types, handler);
        });
    }

    dispatch(event, ...payload) {
        this.inititalize.then(() => {
            this.instance[Symbols.instanceDispatcher].dispatch(event, payload);
        });
    }
}
