System.register(['./symbols'], function (_export) {
    'use strict';

    var Symbols, Metadata;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_symbols) {
            Symbols = _symbols.Symbols;
        }],
        execute: function () {
            Metadata = (function () {
                function Metadata() {
                    _classCallCheck(this, Metadata);

                    this.handlers = new Map();
                    this.awaiters = new Map();
                }

                Metadata.getOrCreateMetadata = function getOrCreateMetadata(target) {
                    if (target[Symbols.metadata] === undefined) {
                        target[Symbols.metadata] = new Metadata();
                    }

                    return target[Symbols.metadata];
                };

                Metadata.exists = function exists(target) {
                    return target[Symbols.metadata] !== undefined && target[Symbols.metadata] instanceof Metadata;
                };

                return Metadata;
            })();

            _export('Metadata', Metadata);
        }
    };
});