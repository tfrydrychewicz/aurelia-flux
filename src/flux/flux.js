import {Dispatcher} from './dispatcher';
import {FluxMetadata, FluxMethodMetadata} from './metadata';

export class Flux {
  
  static __key__ = '__fluxMetadata__';
  
  static getMetadata(target) {
    if(target[Flux.__key__] === undefined) {
      target[Flux.__key__] = new FluxMetadata();
    }  
    
    return target[Flux.__key__];
  }

  static getMethodMetadata(target, method) {
          
    var metadata = Flux.getMetadata(target);
        
    if(!metadata.methods.has(method)) {
      metadata.methods.set(method, new FluxMethodMetadata());
    }
    
    return metadata.methods.get(method);
  }
   
}
