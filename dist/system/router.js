System.register(['aurelia-router', './flux-dispatcher'], function (_export) {
  'use strict';

  var Router, RouterConfiguration, FluxDispatcher, RouterManager, FluxLifeCycleStep;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
      RouterConfiguration = _aureliaRouter.RouterConfiguration;
    }, function (_fluxDispatcher) {
      FluxDispatcher = _fluxDispatcher.FluxDispatcher;
    }],
    execute: function () {
      RouterManager = (function () {
        function RouterManager() {
          _classCallCheck(this, RouterManager);
        }

        RouterManager.AddFluxPipelineStep = function AddFluxPipelineStep(aurelia) {
          var router = aurelia.container.get(Router);
          var configuration = new RouterConfiguration();

          configuration.addPipelineStep("modelbind", FluxLifeCycleStep);
          router.configure(configuration);
        };

        return RouterManager;
      })();

      _export('RouterManager', RouterManager);

      FluxLifeCycleStep = (function () {
        function FluxLifeCycleStep() {
          _classCallCheck(this, FluxLifeCycleStep);
        }

        FluxLifeCycleStep.prototype.run = function run(context, next) {

          if (context && context.plan && context.plan['default']) {
            FluxDispatcher.instance.strategy = context.plan['default'].strategy;
          }

          return next();
        };

        return FluxLifeCycleStep;
      })();
    }
  };
});