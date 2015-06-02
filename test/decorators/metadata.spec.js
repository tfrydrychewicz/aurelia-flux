import {FluxMetadata, FluxMethodMetadata} from '../../src/flux/metadata';
import {Flux} from '../../src/flux/flux';

class TestStore {
  addMessage(env, message) {

  }
}

describe('Tests on using FluxMetadata class', () => {

  var store,
      storeProto;

  beforeAll(() => {
    store = new TestStore();
    storeProto = Object.getPrototypeOf(store);
    Flux.getMethodMetadata(store.__proto__, 'addMessage');
  });

  it('should add flux metadata', () => {
    expect(storeProto[Flux.__key__]).toBeDefined();
    expect(storeProto[Flux.__key__] instanceof FluxMetadata).toEqual(true);
  });

  it('should instantiate methods map', () => {
    expect(storeProto[Flux.__key__].methods).toBeDefined();
    expect(storeProto[Flux.__key__].methods instanceof Map).toEqual(true);
  });

  it('should create method metadata', () => {
    expect(storeProto[Flux.__key__].methods.has('addMessage')).toEqual(true);
    expect(storeProto[Flux.__key__].methods.get('addMessage') instanceof FluxMethodMetadata).toEqual(true);
  });


});
