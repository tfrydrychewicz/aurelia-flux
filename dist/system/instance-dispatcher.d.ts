declare module 'aurelia-flux' {
  import { Metadata }  from 'aurelia-flux/metadata';
  import { Utils }  from 'aurelia-flux/utils';
  import { FluxDispatcher }  from 'aurelia-flux/flux-dispatcher';
  import Promise from 'bluebird';
  import { Symbols }  from 'aurelia-flux/symbols';
  class Handler {
    constructor(regexp: any, handler: any);
  }
  export class Dispatcher {
    constructor(instance: Object);
    
    /**
         * Registers new handler function for given action patterns
         *
         * @method handle
         * @param {String|String[]} patterns
         * @param {(action:String, ...payload : any[]) => any} callback
         * @return {() => void} - unregistering function
         */
    handle(patterns: String | String[], callback: ((action: String) => any)): (() => void);
    
    /**
         * Registers a method that will be invoked when all
         * given types finish dispatching
         * 
         * @method waitFor
         * @param {String|String[]} types
         * @param {(() => any)} handler
         * @return void
         */
    waitFor(types: String | String[], handler: (() => any)): void;
    
    /**
         * Dispatches an action alond with all passed
         * parameters (paylod)
         * 
         * @method dispatch
         * @param {String} action
         * @param {any[]} ...payload
         * @return void 
         */
    dispatch(action: String, ...payload: any[]): void;
    dispatchOwn(action: String, payload: any[]): any;
    registerMetadata(): void;
  }
  export class DispatcherProxy {
    constructor(instancePromise: any);
    handle(patterns: any, handler: any): any;
    waitFor(types: any, handler: any): any;
    dispatch(action: any, ...payload: any[]): any;
  }
}