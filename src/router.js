import {Router, RouterConfiguration} from 'aurelia-router';
import {FluxDispatcher} from './flux-dispatcher'

export class RouterManager {
  static AddFluxPipelineStep(aurelia) {
    let router = aurelia.container.get(Router);
    let configuration = new RouterConfiguration();

    configuration.addPipelineStep("modelbind", FluxLifeCycleStep);
    router.configure(configuration);
  }
}

class FluxLifeCycleStep {
  run(context, next) {

    if(context && context.plan && context.plan.default) {
      FluxDispatcher.instance.strategy = context.plan.default.strategy;
    }

    return next();
  }
}
