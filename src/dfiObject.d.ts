/// <reference types="eventemitter3" />
import * as EventEmitter from "eventemitter3";
import DebugLogger from "local-dfi-debug-logger";
export interface IDfiBaseObjectConfig extends Object {
    loggerName?: string;
}
declare class DfiObject extends EventEmitter {
    private _events;
    destroyed?: boolean;
    constructor(options?: IDfiBaseObjectConfig);
    readonly options: IDfiBaseObjectConfig;
    readonly logger: DebugLogger;
    get(key: any): any;
    set(key: any, value: any): DfiObject;
    has(key: any): boolean;
    delete(key: any): boolean;
    on(event: string | symbol, fn: Function, context?: any): EventEmitter;
    once(event: string | symbol, fn: Function, context?: any): EventEmitter;
    emit(event: string | symbol, ...args: any[]): boolean;
    off(event: string, fn?: Function, context?: any, once?: boolean): EventEmitter;
    destroy(): void;
    __getProp(): Map<any, any>;
    static readonly events: IDfiBaseObjectEvents;
}
export default DfiObject;
export interface IDfiBaseObjectEvents extends Object {
    ALL: symbol;
    DESTROY: symbol;
}
