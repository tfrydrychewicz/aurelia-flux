import {Metadata} from '../metadata';
export function waitFor(...types) {
    console.log(types);
    return function(target, method, descriptor) {

        var metadata = Metadata.getOrCreateMetadata(target);

        if(metadata.awaiters.has(method) === false) {
            metadata.awaiters.set(method, []);
        }

        metadata.awaiters.set(method, metadata.awaiters.get(method).concat(types));
    };
}