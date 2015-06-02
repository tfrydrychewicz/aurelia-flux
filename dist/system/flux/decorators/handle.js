System.register(['../flux'], function (_export) {
  'use strict';

  var Flux, FluxHandlerMetadata;

  _export('handle', handle);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function handle(setup) {
    return function (target, method, descriptor) {
      var metadata = Flux.getMethodMetadata(target, method);
    };
  }

  return {
    setters: [function (_flux) {
      Flux = _flux.Flux;
    }],
    execute: function () {
      FluxHandlerMetadata = function FluxHandlerMetadata() {
        _classCallCheck(this, FluxHandlerMetadata);
      };
    }
  };
});