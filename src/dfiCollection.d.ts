import DfiObject, { IDfiBaseObjectConfig, IDfiBaseObjectEvents } from "./dfiObject";
import DfiModel from "./dfiModel";
export interface IDfiBaseCollectionConfig extends IDfiBaseObjectConfig {
    idField?: string;
    model?: string;
}
declare abstract class DfiCollection extends DfiObject {
    constructor(options: IDfiBaseCollectionConfig);
    has<T extends DfiModel>(element: T): boolean;
    get<T extends DfiModel>(id: any): T;
    add<T extends DfiModel>(element: T): Map<any, any>;
    remove<T extends DfiModel>(element: T): boolean;
    keys(): Array<any>;
    clear(): this;
    forEach(callback: any, thisArg: any): void;
    private _getId(element);
    toArray(): any[];
    toJSON(): {
        size: any;
        entries: any;
    };
    readonly size: any;
    destroy(): void;
    _onMemberAll(event: any): void;
    proxyOn(event: string | symbol, fn: Function, context?: any): void;
    proxyOff(event: string | symbol, fn: Function, context?: any): void;
    proxyOffAll(): void;
    static readonly events: IDfiBaseCollectionEvents;
}
export default DfiCollection;
export interface IDfiBaseCollectionEvents extends IDfiBaseObjectEvents {
    ADD: symbol;
    DELETE: symbol;
    UPDATE: symbol;
}
