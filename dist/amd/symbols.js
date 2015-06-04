define(['exports'], function (exports) {
    'use strict';

    exports.__esModule = true;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Symbols = (function () {
        function Symbols() {
            _classCallCheck(this, Symbols);
        }

        _createClass(Symbols, null, [{
            key: 'instanceDispatcher',
            value: Symbol('fluxDispatcher'),
            enumerable: true
        }, {
            key: 'metadata',
            value: Symbol('fluxMetadata'),
            enumerable: true
        }]);

        return Symbols;
    })();

    exports.Symbols = Symbols;
});