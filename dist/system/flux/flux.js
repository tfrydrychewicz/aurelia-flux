System.register(['./dispatcher', './metadata'], function (_export) {
  'use strict';

  var Dispatcher, FluxMetadata, FluxMethodMetadata, Flux;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_dispatcher) {
      Dispatcher = _dispatcher.Dispatcher;
    }, function (_metadata) {
      FluxMetadata = _metadata.FluxMetadata;
      FluxMethodMetadata = _metadata.FluxMethodMetadata;
    }],
    execute: function () {
      Flux = (function () {
        function Flux() {
          _classCallCheck(this, Flux);
        }

        Flux.getMetadata = function getMetadata(target) {
          if (target[Flux.__key__] === undefined) {
            target[Flux.__key__] = new FluxMetadata();
          }

          return target[Flux.__key__];
        };

        Flux.getMethodMetadata = function getMethodMetadata(target, method) {

          var metadata = Flux.getMetadata(target);

          if (!metadata.methods.has(method)) {
            metadata.methods.set(method, new FluxMethodMetadata());
          }

          return metadata.methods.get(method);
        };

        _createClass(Flux, null, [{
          key: '__key__',
          value: '__fluxMetadata__',
          enumerable: true
        }]);

        return Flux;
      })();

      _export('Flux', Flux);
    }
  };
});