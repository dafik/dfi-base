declare module "local-dfi-base" {
    import DebugLogger = require("local-dfi-debug-logger/debugLogger");
//config
    export interface IDfiBaseObjectConfig extends Object {
        loggerName?: string
    }

    export interface IDfiBaseModelConfig extends IDfiBaseObjectConfig {
        idAttribute?: string,
    }

    export interface IDfiBaseCollectionConfig extends IDfiBaseObjectConfig {
        idField?: string,
        model?: string
    }

//events

    export interface IDfiBaseEventObjectEvents extends Object {
        ALL: symbol
        DESTROY: symbol
    }

    export interface IDfiBaseModelEvents extends IDfiBaseEventObjectEvents {
        ADD: symbol,
        REMOVE: symbol,
        UPDATE: symbol
    }

    export interface IDfiBaseCollectionEvents extends IDfiBaseEventObjectEvents {
        ADD: symbol,
        REMOVE: symbol,
        UPDATE: symbol
    }
//arguments

    export interface IDfiBaseModelAttribs extends Object {
        id?: any
    }


//types

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
        private _events;

        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        eventNames(exists?: boolean): Array<TEventName>;

        /**
         * Return a list of assigned event listeners.
         *
         * @param {String | Symbol} event The events that should be listed.
         * @param {Boolean} exists We only need to know if there are listeners.
         * @returns {Array|Boolean}
         */
        listeners(event?: TEventName, exists?: boolean): Function[] | boolean;

        /**
         * Emit an event to all registered event listeners.
         *
         * @param {String} event The name of the event.
         * @param a1 :a
         * @param a2
         * @param a3
         * @param a4
         * @param a5
         * @param args
         * @returns {Boolean} Indication if we've emitted an event.
         * @api public
         */
        emit(event: TEventName, a1: any, a2: any, a3: any, a4: any, a5: any, ...args: any[]): boolean;

        /**
         * Register a new EventListener for the given event.
         *
         * @param {String} event Name of the event.
         * @param {Function} fn Callback function.
         * @param {*} [context=this] The context of the function.
         * @api public
         */
        on(event: TEventName, fn: Function, context?: any): this;

        /**
         * Add an EventListener that's only called once.
         *
         * @param {String} event Name of the event.
         * @param {Function} fn Callback function.
         * @param {*} [context=this] The context of the function.
         * @api public
         */
        once(event: TEventName, fn: Function, context?: any): EventEmitter;

        /**
         * Remove event listeners.
         *
         * @param {String} event The event we want to remove.
         * @param {Function} fn The listener that we need to find.
         * @param {*} context Only remove listeners matching this context.
         * @param {Boolean} once Only remove once listeners.
         * @api public
         */
        removeListener(event: TEventName, fn?: Function, context?: any, once?: boolean): this;

        /**
         * Remove all listeners or only the listeners for the specified event.
         *
         * @param  event The event want to remove all listeners for.
         */
        removeAllListeners(event?: TEventName): this;
    }

    export abstract class DfiObject {
        destroyed?: boolean;

        constructor(options?: IDfiBaseObjectConfig);

        readonly options: IDfiBaseObjectConfig;
        readonly logger: DebugLogger;

        getProp(key: any): any;

        setProp(key: any, value: any): DfiObject;

        hasProp(key: any): boolean;

        removeProp(key: any): boolean;

        destroy(): void;

        __getProp(): Map<any, any>;

        toPlain(): Object;
    }

    export abstract class DfiEventObject extends DfiObject {
        constructor(options?: IDfiBaseObjectConfig);

        private readonly _ee;

        on(event: TEventName, fn: Function, context?: any): EventEmitter;

        readonly eventNames: (string | symbol)[];

        once(event: TEventName, fn: Function, context?: any): EventEmitter;

        emit(event: TEventName, ...args: any[]): boolean;

        off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter;

        removeAllListeners(event?: string): EventEmitter;

        destroy(): void;

        static readonly events: IDfiBaseEventObjectEvents;
    }


    export abstract class DfiModel extends DfiEventObject {
        static map: Map<string, string>;

        constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig);

        readonly id: any;
        readonly lastUpdate: number;

        stampLastUpdate(): void;

        destroy(): void;

        get(attribute: string): any;

        has(attribute: string): boolean;

        set(attribute: string | Object, value: any, silent?: boolean): this;

        remove(attribute: any): any;

        static readonly events: IDfiBaseModelEvents;

        toJSON(): Object;

        toPlain(): Object;

        private _getAttributeMap(attributes);
    }


    export abstract class DfiCollection extends DfiEventObject {

        constructor(options?: IDfiBaseCollectionConfig);

        has<T extends DfiModel>(element: T | any): boolean;

        get<T extends DfiModel>(id: any): T;

        add<T extends DfiModel>(element: T): Map<any, any>;

        remove<T extends DfiModel>(element: T | any): boolean;

        keys(): Array<any>;

        clear(): this;

        forEach<K, V>(Fn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;

        toArray<T extends DfiModel>(): Array<T>;

        toJSON(): Object;

        readonly size: any;

        destroy(): void;

        _onMemberAll(event: any): void;

        proxyOn(event: TEventName, fn: Function, context?: any): void;

        proxyOff(event: TEventName, fn: Function, context?: any): void;

        proxyOffAll(): void;

        static readonly events: IDfiBaseCollectionEvents;
    }
    declare class DfiUtil {
        static maybeCallbackOnce(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;
        static maybeCallback(fn: IDfiCallbackResult, context: any, err?: any, response?: any): void;
        private static readonly logger;
        private static _entries<V>(obj);
        static obj2map<V>(obj: {
            [key: string]: V;
        }): Map<string, V>;
    }

}