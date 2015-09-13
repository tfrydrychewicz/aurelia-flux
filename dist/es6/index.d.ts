declare module 'aurelia-flux' {
  import { LifecycleManager }  from 'aurelia-flux/lifecycle-manager';
  import { RouterManager }  from 'aurelia-flux/router';
  export { Dispatcher } from 'aurelia-flux/instance-dispatcher';
  
  /*
   * Decorators
   */
  export { handle } from 'aurelia-flux/decorators/handle';
  export { waitFor } from 'aurelia-flux/decorators/waitFor';
  export function configure(aurelia: any, configCallback: any): any;
}