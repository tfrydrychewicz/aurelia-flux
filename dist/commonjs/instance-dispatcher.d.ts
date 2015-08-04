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
    
    
    handle(patterns: String | String[], callback: ((action: String) => any)): (() => void);
    
    
    waitFor(types: String | String[], handler: (() => any)): void;
    
    
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