export {handle} from './flux/decorators/handle';
export {waitFor} from './flux/decorators/waitFor';
export {Dispatcher} from './flux/dispatcher';

import {Dispatcher} from './flux/dispatcher';
import {setupInterceptor} from './flux/class-activator-interceptor';

setupInterceptor();

export function configure(aurelia, configCallback) {
  
}
