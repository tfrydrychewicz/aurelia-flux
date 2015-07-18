import Promise from 'bluebird';

export class FluxDispatcher {
    static instance = new FluxDispatcher();

    constructor() {
        this.instanceDispatchers = new Map();
        this.isDispatching = false;
        this.queue = [];
        this.typesPromises = new Map();
    }

    getOrCreateTypeDispatchers(type) {
        if(this.instanceDispatchers.has(type) === false) {
            this.instanceDispatchers.set(type, new Set());
        }

        return this.instanceDispatchers.get(type);
    }

    getOrCreateTypePromises(type) {
        if(this.typesPromises.has(type) === false) {
            this.typesPromises.set(type, Promise.defer());
        }

        return this.typesPromises.get(type);
    }

    registerInstanceDispatcher(dispatcher) {
        if(dispatcher === undefined || dispatcher.instance === undefined) {
            return;
        }

        var typeDispatchers = this.getOrCreateTypeDispatchers(Object.getPrototypeOf(dispatcher.instance));

        typeDispatchers.add(dispatcher);
    }

    unregisterInstanceDispatcher(dispatcher) {
        if(dispatcher === undefined || dispatcher.instance === undefined) {
            return;
        }

        let type = Object.getPrototypeOf(dispatcher.instance);

        if(this.instanceDispatchers.has(type) === false) {
            return;
        }

        this.instanceDispatchers.get(type).delete(dispatcher);

        if(this.instanceDispatchers.get(type).size === 0) {
            this.instanceDispatchers.delete(type);
        }
    }

    dispatch(event, payload) {
        this.$dispatch(event, payload, false);
    }

    $dispatch(event, payload, fromQueue) {

        if(this.isDispatching && fromQueue === false) {
            this.queue.push([event, payload]);
            return;
        }

        this.isDispatching = true;

        this.typesPromises = new Map();

        this.instanceDispatchers.forEach((dispatchers, type) => {

            var typePromise = this.getOrCreateTypePromises(type);
            var promises = [];

            dispatchers.forEach((dispatcher) => {
               promises.push(dispatcher.dispatchOwn.apply(dispatcher, [event, payload]));
            });

            Promise.settle(promises).then(() => {
                typePromise.resolve();
            });
        });


        this.typesPromises.forEach((promise, type) => {
            if(this.instanceDispatchers.has(type) === false) {

                let name = (type !== undefined && type.constructor !== undefined && type.constructor.name !== undefined) ? type.constructor.name : type.toString();
                console.warn(`You are waiting for a type '${name}' that didn't handle event '${event}'. ${name} promise has been resolved automatically.`);

                promise.resolve();
            }
        });

        var allTypesPromises = Array.from(this.typesPromises.values()).map((defer) => { return defer.promise; });

        Promise.settle(allTypesPromises).then(() => {
            let next = this.queue.shift();
            setTimeout(() => {
                if(next !== undefined) {
                    this.$dispatch(next[0], next[1], true);
                } else {
                    this.isDispatching = false;
                }
            }, 0);
        });
    }

    waitFor(types, handler) {
        if(Array.isArray(types) === false) {
            types = [types];
        }

        let typesPromises = types.map((type) => {
            return this.getOrCreateTypePromises(type.prototype).promise;
        });

        Promise.settle(typesPromises).then(() => {
           handler();
        });
    }
}