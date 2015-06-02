import {handle} from '../../src/flux/decorators/handle';
import {Flux} from '../../src/flux/flux';

describe('Tests on using @handle decorator', () => {

  var TestStore;
  
  beforeEach(() => {    
    spyOn(Flux, 'getMethodMetadata');
    
    TestStore = class {
      @handle('message.add')
      addMessage() {
      }
    }
  });
  
  it('should call Flux.getMethodMetadata when initializing', () => {      
    
    var store = new TestStore();
    
    expect(Flux.getMethodMetadata).toHaveBeenCalledWith(store.__proto__, 'addMessage');    
  });

});
