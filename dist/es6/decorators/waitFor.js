import {Metadata} from '../metadata';

export function waitFor(...types) {
    return function (target, method) {
        var metadata = Metadata.getOrCreateMetadata(target);

        if(metadata.awaiters.has(method) === false) {
            metadata.awaiters.set(method, []);
        }

        metadata.awaiters.set(method, metadata.awaiters.get(method).concat(types));
    };
}