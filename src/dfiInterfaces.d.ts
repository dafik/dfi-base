export interface IDfiBaseObjectEvents extends Object {
    ALL: symbol;
    DESTROY: symbol;
}
export interface IDfiBaseObjectConfig extends Object {
    loggerName?: string;
}
export interface IDfiBaseModelConfig extends IDfiBaseObjectConfig {
    idAttribute?: string;
}
export interface IDfiBaseCollectionConfig extends IDfiBaseObjectConfig {
    idField?: string;
    model?: string;
}
export interface IDfiBaseModelEvents extends IDfiBaseObjectEvents {
    ADD: symbol;
    DELETE: symbol;
    UPDATE: symbol;
}
export interface IDfiBaseCollectionEvents extends IDfiBaseObjectEvents {
    ADD: symbol;
    DELETE: symbol;
    UPDATE: symbol;
}
