define(['exports', './lifecycle-manager', './router', './instance-dispatcher', './decorators/handle', './decorators/waitFor'], function (exports, _lifecycleManager, _router, _instanceDispatcher, _decoratorsHandle, _decoratorsWaitFor) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;
    exports.Dispatcher = _instanceDispatcher.Dispatcher;
    exports.handle = _decoratorsHandle.handle;
    exports.waitFor = _decoratorsWaitFor.waitFor;

    function configure(aurelia, configCallback) {
        _lifecycleManager.LifecycleManager.interceptClassActivator();
        _lifecycleManager.LifecycleManager.interceptHtmlBehaviorResource();
        _router.RouterManager.AddFluxPipelineStep(aurelia);
    }
});