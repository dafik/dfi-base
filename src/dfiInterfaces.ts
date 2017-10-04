// config
import EventEmitter from "./dfiEventEmitter";

export interface IDfiBaseObjectConfig extends Object {
    loggerName?: string;
    maxEvents?: number;
}

export interface IDfiBaseModelConfig extends IDfiBaseObjectConfig {
    idAttribute?: string;
}

export interface IDfiBaseCollectionConfig<M> extends IDfiBaseObjectConfig {
    idField?: string;
    model?: new (...args: any[]) => M;
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

export interface IDfiProxyCallback {
    c: (...args) => void;
    t?: any;
}

// test

export interface ITestModelObjectAttribs extends IDfiBaseModelAttribs {
    a?: string;
    b?: string;
}

export interface IDfiBase2Plain {
    [key: string]: any;
}

export interface IDfiBaseEvent2Plain extends IDfiBase2Plain {
    emitter: EventEmitter;
}

export interface IDfiBaseObject2Plain {
    prop: IDfiBase2Plain;
}

export interface IDfiBaseEventObject2Plain {
    prop: IDfiBaseEvent2Plain;
}

export interface IDfiBaseModel2Plain {
    attr: IDfiBase2Plain;
    prop: IDfiBaseEvent2Plain;
}
