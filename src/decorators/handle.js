import {Metadata} from '../metadata';
export function handle(...patterns) {
    return function(target, method, descriptor) {

        var metadata = Metadata.getOrCreateMetadata(target);

        if(metadata.handlers.has(method) === false) {
            metadata.handlers.set(method, []);
        }

        metadata.handlers.set(method, metadata.handlers.get(method).concat(patterns));
    };
}