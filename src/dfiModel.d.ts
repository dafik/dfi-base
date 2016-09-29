import DfiObject, { IDfiBaseObjectEvents, IDfiBaseObjectConfig } from "./dfiObject";
declare abstract class DfiModel extends DfiObject {
    attributes: Map<any, any>;
    id: string;
    constructor(attributes: Object, options: IDfiBaseObjectConfig);
    getLastUpdateMillis(): any;
    stampLastUpdate(): void;
    destroy(): void;
    get(attribute: string): any;
    has(attribute: string): boolean;
    set(attribute: string | Object, value: any, silent?: boolean): this;
    delete(attribute: any): boolean;
    getProp(key: any): any;
    setProp(key: any, value: any): DfiObject;
    hasProp(key: any): boolean;
    deleteProp(key: any): boolean;
    static readonly events: IDfiBaseModelEvents;
    toJSON(): Object;
    toPlain(): Object;
}
export default DfiModel;
export interface IDfiBaseModelEvents extends IDfiBaseObjectEvents {
    ADD: symbol;
    DELETE: symbol;
    UPDATE: symbol;
}
