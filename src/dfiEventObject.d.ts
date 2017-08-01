import EventEmitter from "./dfiEventEmitter";
import { IDfiBaseEventObjectEvents, IDfiBaseObjectConfig, TEventName } from "./dfiInterfaces";
import DfiObject from "./dfiObject";
export declare abstract class DfiEventObject extends DfiObject {
    static readonly events: IDfiBaseEventObjectEvents;
    readonly eventNames: TEventName[];
    readonly maxEvents: any;
    private readonly _ee;
    constructor(options?: IDfiBaseObjectConfig);
    destroy(): void;
    on(event: TEventName, fn: (...args) => void, context?: any): EventEmitter;
    once(event: TEventName, fn: (...args) => void, context?: any): EventEmitter;
    emit(event: TEventName, ...args: any[]): boolean;
    off(event: TEventName, fn?: (...args) => void, context?: any, once?: boolean): EventEmitter;
    removeAllListeners(event?: TEventName): EventEmitter;
}
export default DfiEventObject;
