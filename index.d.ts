declare module "local-dfi-base" {
    import DebugLogger = require("local-dfi-debug-logger");
    import EventEmitter = require("./dfiEventEmitter");

    // config
    export interface IDfiBaseObjectConfig extends Object {
        loggerName?: string;
    }
    export interface IDfiBaseModelConfig extends IDfiBaseObjectConfig {
        idAttribute?: string;
    }
    export interface IDfiBaseCollectionConfig<M> extends IDfiBaseObjectConfig {
        idField?: string;
        model?: typeof M;
    }

    // events
    export interface IDfiBaseEventObjectEvents extends Object {
        ALL: symbol;
        DESTROY: symbol;
    }
    export interface IDfiBaseModelEvents extends IDfiBaseEventObjectEvents {
        ADD: symbol;
        REMOVE: symbol;
        UPDATE: symbol;
    }
    export interface IDfiBaseCollectionEvents extends IDfiBaseEventObjectEvents {
        ADD: symbol;
        REMOVE: symbol;
        UPDATE: symbol;
    }

    // arguments
    export interface IDfiBaseModelAttribs extends Object {
        id?: any;
    }

    // types
    export type TEventName = string | symbol;
    export interface IDfiCallbackError extends Function {
        (error?: Error): void;
        fired?: boolean;
    }
    export interface IDfiCallbackResult extends IDfiCallbackError {
        (error?: Error, result?): void;
        fired?: boolean;
    }

    /**
     * Minimal EventEmitter interface that is molded against the Node.js
     * EventEmitter interface.
     */
    class EventEmitter {
        public eventNames(exists?: boolean): Array<TEventName>;

        public listeners(event?: TEventName, exists?: boolean): Function[] | boolean;

        public emit(event: TEventName, a1: any, a2: any, a3: any, a4: any, a5: any, ...args: any[]): boolean;

        public on(event: TEventName, fn: Function, context?: any): this;

        public once(event: TEventName, fn: Function, context?: any): EventEmitter;

        public removeListener(event: TEventName, fn?: Function, context?: any, once?: boolean): this;

        public removeAllListeners(event?: TEventName): this;
    }

    // object
    export abstract class DfiObject {
        public destroyed?: boolean;
        public readonly logger: DebugLogger;

        constructor(options?: IDfiBaseObjectConfig);

        public destroy(): void;

        public toPlain(): Object;

        protected getProp(key: any): any;

        protected setProp(key: any, value: any): DfiObject;

        protected hasProp(key: any): boolean;

        protected removeProp(key: any): boolean;
    }

    // eventObject

    export abstract class DfiEventObject extends DfiObject {
        public static readonly events: IDfiBaseEventObjectEvents;
        public readonly eventNames: (string | symbol)[];

        constructor(options?: IDfiBaseObjectConfig);

        public destroy(): void;

        public on(event: TEventName, fn: Function, context?: any): EventEmitter;

        public once(event: TEventName, fn: Function, context?: any): EventEmitter;

        public emit(event: TEventName, ...args: any[]): boolean;

        public off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter;

        public removeAllListeners(event?: string): EventEmitter;
    }

    // model
    export abstract class DfiModel extends DfiEventObject {
        public static readonly events: IDfiBaseModelEvents;
        protected static map: Map<string, string>;
        public readonly id: any;
        public readonly lastUpdate: number;

        constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig);

        public destroy(): void;

        public toJSON(): Object;

        public toPlain(): Object;

        protected get(attribute: string): any;

        protected has(attribute: string): boolean;

        protected set(attribute: string | Object, value: any, silent?: boolean): this;

        protected remove(attribute: any): any;
    }

    // collection
    export abstract class DfiCollection<M extends DfiModel> extends DfiEventObject {
        public static readonly events: IDfiBaseCollectionEvents;
        public readonly size: number;

        constructor(options?: IDfiBaseCollectionConfig<M>);

        public destroy(): void;

        public toJSON(): Object;

        protected has(element: M | any): boolean;

        protected get(id: any): M;

        protected add(element: M): this;

        protected remove(element: M | any): boolean;

        protected keys(): Array<any>;

        protected clear(): this;

        protected forEach<K, V>(fn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;

        protected toArray(): Array<M>;

        protected proxyOn(event: TEventName, fn: Function, context?: any): this;

        protected proxyOff(event: TEventName, fn: Function, context?: any): this;

        protected proxyOffAll(): this;
    }

    // utils
    export class DfiUtil {
        public static maybeCallbackOnce(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;

        public static maybeCallback(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;

        public static obj2map<V>(obj: {
            [key: string]: V;
        }): Map<string, V>;
    }
}
