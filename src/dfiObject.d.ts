import DebugLogger = require("local-dfi-debug-logger/debugLogger");
import EventEmitter = require("./dfiEventEmitter");
import { IDfiBaseObjectConfig, IDfiBaseObjectEvents } from "./dfiInterfaces";
declare abstract class DfiObject {
    destroyed?: boolean;
    constructor(options?: IDfiBaseObjectConfig);
    readonly options: IDfiBaseObjectConfig;
    readonly logger: DebugLogger;
    getProp(key: any): any;
    setProp(key: any, value: any): DfiObject;
    hasProp(key: any): boolean;
    removeProp(key: any): boolean;
    private readonly _ee;
    on(event: string | symbol, fn: Function, context?: any): EventEmitter;
    readonly eventNames: (string | symbol)[];
    once(event: string | symbol, fn: Function, context?: any): EventEmitter;
    emit(event: string | symbol, ...args: any[]): boolean;
    off(event: string, fn?: Function, context?: any, once?: boolean): EventEmitter;
    removeAllListeners(event?: string): EventEmitter;
    destroy(): void;
    __getProp(): Map<any, any>;
    toPlain(): Object;
    static readonly events: IDfiBaseObjectEvents;
}
export = DfiObject;
