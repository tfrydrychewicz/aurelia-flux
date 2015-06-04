import Promise from 'bluebird';

export class FluxDispatcher {
    static instance = new FluxDispatcher();

    constructor() {
        this.instanceDispatchers = new Map();
        this.dispatching = false;
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

        var type = Object.getPrototypeOf(dispatcher.instance);

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

        if(this.dispatching && fromQueue === false) {
            this.queue.push([event, payload]);
            return;
        }

        this.dispatching = true;

        this.typesPromises = new Map();

        this.instanceDispatchers.forEach((dispatchers, type) => {

            var promises = [];

            dispatchers.forEach((dispatcher) => {
               promises.push(dispatcher.dispatchOwn.apply(dispatcher, [event, payload]));
            });

            Promise.settle(promises).then(() => {
               this.getOrCreateTypePromises(type).resolve();
            });
        });

        Promise.settle(Array.from(this.typesPromises.values())).then(() => {
            var next = this.queue.shift();
            setTimeout(() => {
                if(next !== undefined) {
                    this.$dispatch(next[0], next[1], true);
                } else {
                    this.dispatching = false;
                }
            }, 0);
        });
    }
}