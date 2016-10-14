/// <reference types="lodash" />
import { IDfiBaseModelAttribs, IDfiBaseModelConfig, IDfiBaseModelEvents } from "./dfiInterfaces";
import DfiEventObject = require("./dfiEventObject");
declare abstract class DfiModel extends DfiEventObject {
    protected static map: Map<string, string>;
    /**
     * @param attributes
     * @param options
     * @param notMakeStamp
     */
    constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig, notMakeStamp?: boolean);
    readonly id: any;
    readonly lastUpdate: number;
    stampLastUpdate(time?: number): void;
    toJSON(): Object;
    toPlain(): Object;
    destroy(): void;
    protected get(attribute: string): any;
    protected has(attribute: string): boolean;
    protected set(attribute: string | Object, value: any, silent?: boolean): this;
    protected remove(attribute: any): any;
    static readonly events: IDfiBaseModelEvents;
    private _getAttributeMap(attributes);
}
export = DfiModel;
