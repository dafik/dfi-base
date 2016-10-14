/// <reference types="lodash" />
import { IDfiBaseCollectionConfig, IDfiBaseCollectionEvents, TEventName } from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");
import DfiModel = require("./dfiModel");
declare abstract class DfiCollection<M extends DfiModel> extends DfiEventObject {
    constructor(options?: IDfiBaseCollectionConfig);
    readonly size: any;
    static readonly events: IDfiBaseCollectionEvents;
    toJSON(): Object;
    protected has(element: M | any): boolean;
    protected get(id: any): M;
    protected add(element: M): Map<any, M>;
    protected remove(element: M | any): boolean;
    protected keys(): Array<any>;
    protected clear(): this;
    protected forEach(fn: (value: M, index: any, map: Map<any, M>) => void, context?: any): void;
    protected toArray(): Array<M>;
    protected destroy(): void;
    protected proxyOn(event: TEventName, fn: Function, context?: any): void;
    protected proxyOff(event: TEventName, fn: Function, context?: any): void;
    protected proxyOffAll(): void;
    private _onMemberAll(event);
}
export = DfiCollection;
