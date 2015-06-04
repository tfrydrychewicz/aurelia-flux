define(['exports', '../metadata'], function (exports, _metadata) {
    'use strict';

    exports.__esModule = true;
    exports.waitFor = waitFor;

    function waitFor() {
        for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
            types[_key] = arguments[_key];
        }

        console.log(types);
        return function (target, method, descriptor) {

            var metadata = _metadata.Metadata.getOrCreateMetadata(target);

            if (metadata.awaiters.has(method) === false) {
                metadata.awaiters.set(method, []);
            }

            metadata.awaiters.set(method, metadata.awaiters.get(method).concat(types));
        };
    }
});