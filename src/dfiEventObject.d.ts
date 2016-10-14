import EventEmitter = require("./dfiEventEmitter");
import { IDfiBaseEventObjectEvents, IDfiBaseObjectConfig, TEventName } from "./dfiInterfaces";
import DfiObject = require("./dfiObject");
declare abstract class DfiEventObject extends DfiObject {
    constructor(options?: IDfiBaseObjectConfig);
    readonly eventNames: (string | symbol)[];
    private readonly _ee;
    static readonly events: IDfiBaseEventObjectEvents;
    on(event: TEventName, fn: Function, context?: any): EventEmitter;
    once(event: TEventName, fn: Function, context?: any): EventEmitter;
    off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter;
    removeAllListeners(event?: string): EventEmitter;
    protected emit(event: TEventName, ...args: any[]): boolean;
    protected destroy(): void;
}
export = DfiEventObject;
