import {Flux} from '../flux';

class FluxWaiterMetadata {

}

export function waitFor(setup) {
  return function(target, method, descriptor) {
    var metadata = Flux.getMethodMetadata(target, method);
  };
}
