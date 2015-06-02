System.register(['./flux/dispatcher', './flux/class-activator-interceptor', './flux/decorators/handle', './flux/decorators/waitFor'], function (_export) {
  'use strict';

  var Dispatcher, setupInterceptor;

  _export('configure', configure);

  function configure(aurelia, configCallback) {}

  return {
    setters: [function (_fluxDispatcher) {
      Dispatcher = _fluxDispatcher.Dispatcher;

      _export('Dispatcher', _fluxDispatcher.Dispatcher);
    }, function (_fluxClassActivatorInterceptor) {
      setupInterceptor = _fluxClassActivatorInterceptor.setupInterceptor;
    }, function (_fluxDecoratorsHandle) {
      _export('handle', _fluxDecoratorsHandle.handle);
    }, function (_fluxDecoratorsWaitFor) {
      _export('waitFor', _fluxDecoratorsWaitFor.waitFor);
    }],
    execute: function () {

      setupInterceptor();
    }
  };
});