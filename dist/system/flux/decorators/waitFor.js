System.register(['../flux'], function (_export) {
  'use strict';

  var Flux, FluxWaiterMetadata;

  _export('waitFor', waitFor);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function waitFor(setup) {
    return function (target, method, descriptor) {
      var metadata = Flux.getMethodMetadata(target, method);
    };
  }

  return {
    setters: [function (_flux) {
      Flux = _flux.Flux;
    }],
    execute: function () {
      FluxWaiterMetadata = function FluxWaiterMetadata() {
        _classCallCheck(this, FluxWaiterMetadata);
      };
    }
  };
});