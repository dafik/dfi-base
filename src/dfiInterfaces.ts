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

export interface IDfiBaseObjectEvents extends Object {
    ALL: symbol
    DESTROY: symbol
}

export interface IDfiBaseModelEvents extends IDfiBaseObjectEvents {
    ADD: symbol,
    REMOVE: symbol,
    UPDATE: symbol
}

export interface IDfiBaseCollectionEvents extends IDfiBaseObjectEvents {
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

