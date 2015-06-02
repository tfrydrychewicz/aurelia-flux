System.register(['./dispatcher', './flux', 'aurelia-framework'], function (_export) {
  'use strict';

  var Dispatcher, Flux, ClassActivator;

  _export('setupInterceptor', setupInterceptor);

  function setupInterceptor() {

    if (ClassActivator.instance === undefined || ClassActivator.instance.invoke === undefined) {
      throw new Error('Unsupported version of ClassActivator');
    }

    var invokeImpl = ClassActivator.instance.invoke;
    ClassActivator.instance.invoke = function () {
      for (var _len = arguments.length, invokeArgs = Array(_len), _key = 0; _key < _len; _key++) {
        invokeArgs[_key] = arguments[_key];
      }

      var fn = invokeArgs[0];
      var args = invokeArgs[1];
      var instance = invokeImpl.apply(invokeImpl, invokeArgs);
      var dispatcher = args.find(function (item, i) {
        return item instanceof Dispatcher;
      });

      if (dispatcher) {
        dispatcher.setInstance(instance);
        Flux.getMetadata(instance.__proto__);
      }

      return instance;
    };
  }

  return {
    setters: [function (_dispatcher) {
      Dispatcher = _dispatcher.Dispatcher;
    }, function (_flux) {
      Flux = _flux.Flux;
    }, function (_aureliaFramework) {
      ClassActivator = _aureliaFramework.ClassActivator;
    }],
    execute: function () {}
  };
});