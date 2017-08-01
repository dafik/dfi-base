import { IDfiBaseModelConfig, ITestModelObjectAttribs } from "../../src/dfiInterfaces";
import DfiModel from "../../src/dfiModel";
declare class TestModelObject extends DfiModel {
    protected static map: Map<string, string>;
    constructor(attributes?: ITestModelObjectAttribs, options?: IDfiBaseModelConfig);
    get(attribute: string): any;
    has(attribute: string): boolean;
    set(attribute: string | object, value: any, silent?: boolean): this;
    remove(attribute: any): boolean | IDBRequest;
}
export default TestModelObject;
