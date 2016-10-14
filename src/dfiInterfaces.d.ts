export interface IDfiBaseObjectConfig extends Object {
    loggerName?: string;
}
export interface IDfiBaseModelConfig extends IDfiBaseObjectConfig {
    idAttribute?: string;
}
export interface IDfiBaseCollectionConfig extends IDfiBaseObjectConfig {
    idField?: string;
    model?: Function;
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
