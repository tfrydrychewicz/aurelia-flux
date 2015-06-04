define(['exports', '../metadata'], function (exports, _metadata) {
    'use strict';

    exports.__esModule = true;
    exports.handle = handle;

    function handle() {
        for (var _len = arguments.length, patterns = Array(_len), _key = 0; _key < _len; _key++) {
            patterns[_key] = arguments[_key];
        }

        return function (target, method, descriptor) {

            var metadata = _metadata.Metadata.getOrCreateMetadata(target);

            if (metadata.handlers.has(method) === false) {
                metadata.handlers.set(method, []);
            }

            metadata.handlers.set(method, metadata.handlers.get(method).concat(patterns));
        };
    }
});