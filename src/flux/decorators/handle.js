import {Flux} from '../flux';

class FluxHandlerMetadata {

}

export function handle(setup) {
  return function(target, method, descriptor) {
    var metadata = Flux.getMethodMetadata(target, method);    
  };
}
