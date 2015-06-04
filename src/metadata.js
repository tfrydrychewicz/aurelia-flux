import {Symbols} from './symbols';
export class Metadata {

    static getOrCreateMetadata(target) {
        if(target[Symbols.metadata] === undefined) {
            target[Symbols.metadata] = new Metadata();
        }

        return target[Symbols.metadata];
    }

    static exists(target) {
        return target[Symbols.metadata] !== undefined && target[Symbols.metadata] instanceof Metadata;
    }

    constructor() {
        this.handlers = new Map();
        this.awaiters = new Map();
    }

}