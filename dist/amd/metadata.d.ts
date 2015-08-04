declare module 'aurelia-flux' {
  import { Symbols }  from 'aurelia-flux/symbols';
  export class Metadata {
    static getOrCreateMetadata(target: any): any;
    static exists(target: any): any;
    constructor();
  }
}