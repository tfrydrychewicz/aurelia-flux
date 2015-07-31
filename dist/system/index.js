System.register(['./lifecycle-manager', './router', './instance-dispatcher', './decorators/handle', './decorators/waitFor'], function (_export) {
    'use strict';

    var LifecycleManager, RouterManager;

    _export('configure', configure);

    function configure(aurelia, configCallback) {
        LifecycleManager.interceptClassActivator();
        LifecycleManager.interceptHtmlBehaviorResource();
        RouterManager.AddFluxPipelineStep(aurelia);
    }

    return {
        setters: [function (_lifecycleManager) {
            LifecycleManager = _lifecycleManager.LifecycleManager;
        }, function (_router) {
            RouterManager = _router.RouterManager;
        }, function (_instanceDispatcher) {
            _export('Dispatcher', _instanceDispatcher.Dispatcher);
        }, function (_decoratorsHandle) {
            _export('handle', _decoratorsHandle.handle);
        }, function (_decoratorsWaitFor) {
            _export('waitFor', _decoratorsWaitFor.waitFor);
        }],
        execute: function () {}
    };
});