declare module 'aurelia-flux' {
  import Promise from 'bluebird';
  import { Dispatcher }  from 'aurelia-flux/instance-dispatcher';
  export class FluxDispatcher {
    static instance: any;
    constructor();
    getOrCreateTypeDispatchers(type: Object): Set;
    getOrCreateTypePromises(type: Object): any;
    registerInstanceDispatcher(dispatcher: Dispatcher): any;
    unregisterInstanceDispatcher(dispatcher: Dispatcher): any;
    dispatch(action: String, payload: any): any;
    $dispatch(action: String, payload: any, fromQueue: boolean): any;
    waitFor(types: String | String[], handler: (() => any)): any;
  }
}