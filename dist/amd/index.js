define(['exports', './lifecycle-manager', './instance-dispatcher', './decorators/handle', './decorators/waitFor'], function (exports, _lifecycleManager, _instanceDispatcher, _decoratorsHandle, _decoratorsWaitFor) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;
  exports.Dispatcher = _instanceDispatcher.Dispatcher;
  exports.handle = _decoratorsHandle.handle;
  exports.waitFor = _decoratorsWaitFor.waitFor;

  function configure(aurelia, configCallback) {
    _lifecycleManager.LifecycleManager.interceptClassActivator();
  }
});