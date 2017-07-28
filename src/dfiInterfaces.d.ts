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
export interface IDfiBaseModelAttribs extends Object {
    id?: any;
}
export declare type TEventName = string | symbol;
export interface IDfiCallbackError extends Function {
    (error?: Error): void;
    fired?: boolean;
}
export interface IDfiCallbackResult extends IDfiCallbackError {
    (error?: Error, result?: any): void;
    fired?: boolean;
}
export interface IDfiProxyCallback {
    c: (...args) => void;
    t?: any;
}
export interface ITestModelObjectAttribs extends IDfiBaseModelAttribs {
    a?: string;
    b?: string;
}
