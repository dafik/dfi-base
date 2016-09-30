import DfiObject = require("./dfiObject");
import { IDfiBaseObjectConfig, IDfiBaseModelEvents } from "./dfiInterfaces";
declare abstract class DfiModel extends DfiObject {
    attributes: Map<any, any>;
    constructor(attributes: Object, options: IDfiBaseObjectConfig);
    readonly id: any;
    stampLastUpdate(): void;
    destroy(): void;
    get(attribute: string): any;
    has(attribute: string): boolean;
    set(attribute: string | Object, value: any, silent?: boolean): this;
    remove(attribute: any): any;
    static readonly events: IDfiBaseModelEvents;
    toJSON(): Object;
    toPlain(): Object;
}
export = DfiModel;
