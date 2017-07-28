import { IDfiBaseModelAttribs, IDfiBaseModelConfig, IDfiBaseModelEvents } from "./dfiInterfaces";
import DfiEventObject from "./dfiEventObject";
export declare abstract class DfiModel extends DfiEventObject {
    static readonly events: IDfiBaseModelEvents;
    protected static map: Map<string, string>;
    readonly id: any;
    readonly lastUpdate: number;
    constructor(attributes?: IDfiBaseModelAttribs, options?: IDfiBaseModelConfig);
    destroy(): void;
    toJSON(): object;
    toPlain(): object;
    protected get(attribute: string): any;
    protected has(attribute: string): boolean;
    protected set(attribute: string | object, value: any, silent?: boolean): this;
    protected remove(attribute: any): any;
    protected stampLastUpdate(): void;
    private _getAttributeMap(attributes);
}
export default DfiModel;
