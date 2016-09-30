import DfiObject = require("./dfiObject");
import { IDfiBaseCollectionEvents, IDfiBaseCollectionConfig } from "./dfiInterfaces";
import DfiModel = require("./dfiModel");
declare abstract class DfiCollection extends DfiObject {
    constructor(options: IDfiBaseCollectionConfig);
    has<T extends DfiModel>(element: T | any): boolean;
    get<T extends DfiModel>(id: any): T;
    add<T extends DfiModel>(element: T): Map<any, any>;
    remove<T extends DfiModel>(element: T | any): boolean;
    keys(): Array<any>;
    clear(): this;
    forEach(callback: any, thisArg: any): void;
    toArray<T extends DfiModel>(): Array<T>;
    toJSON(): Object;
    readonly size: any;
    destroy(): void;
    _onMemberAll(event: any): void;
    proxyOn(event: string | symbol, fn: Function, context?: any): void;
    proxyOff(event: string | symbol, fn: Function, context?: any): void;
    proxyOffAll(): void;
    static readonly events: IDfiBaseCollectionEvents;
}
export = DfiCollection;
