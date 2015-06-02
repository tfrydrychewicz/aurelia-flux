import {instanceActivator} from 'aurelia-framework';


export class FluxDispatcher {    
  static instance = new FluxDispatcher();
  
  constructor() {
  }

  dispatch() {
  }

}

export class Dispatcher {      
  setInstance(instance) {
    this.instance = instance;    
  }
  
  listenTo(patterns, handler) {
  }
  
  waitFor(type, handler) {
  }
}
