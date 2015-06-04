System.register(['../metadata'], function (_export) {
    'use strict';

    var Metadata;

    _export('handle', handle);

    function handle() {
        for (var _len = arguments.length, patterns = Array(_len), _key = 0; _key < _len; _key++) {
            patterns[_key] = arguments[_key];
        }

        return function (target, method, descriptor) {

            var metadata = Metadata.getOrCreateMetadata(target);

            if (metadata.handlers.has(method) === false) {
                metadata.handlers.set(method, []);
            }

            metadata.handlers.set(method, metadata.handlers.get(method).concat(patterns));
        };
    }

    return {
        setters: [function (_metadata) {
            Metadata = _metadata.Metadata;
        }],
        execute: function () {}
    };
});