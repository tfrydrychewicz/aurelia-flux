'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaRouter = require('aurelia-router');

var _fluxDispatcher = require('./flux-dispatcher');

var RouterManager = (function () {
  function RouterManager() {
    _classCallCheck(this, RouterManager);
  }

  RouterManager.AddFluxPipelineStep = function AddFluxPipelineStep(aurelia) {
    var router = aurelia.container.get(_aureliaRouter.Router);
    var configuration = new _aureliaRouter.RouterConfiguration();

    configuration.addPipelineStep("modelbind", FluxLifeCycleStep);
    router.configure(configuration);
  };

  return RouterManager;
})();

exports.RouterManager = RouterManager;

var FluxLifeCycleStep = (function () {
  function FluxLifeCycleStep() {
    _classCallCheck(this, FluxLifeCycleStep);
  }

  FluxLifeCycleStep.prototype.run = function run(context, next) {

    if (context && context.plan && context.plan['default']) {
      _fluxDispatcher.FluxDispatcher.instance.strategy = context.plan['default'].strategy;
    }

    return next();
  };

  return FluxLifeCycleStep;
})();