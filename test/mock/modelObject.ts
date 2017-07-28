import DfiModel from "../../src/dfiModel";
import {IDfiBaseModelConfig, ITestModelObjectAttribs} from "../../src/dfiInterfaces";

class TestModelObject extends DfiModel {

    protected static map = new Map([
        ["a", "a"],
        ["b", "b"]
    ]);

    constructor(attributes: ITestModelObjectAttribs, options?: IDfiBaseModelConfig) {
        super(attributes, options);
    }

    public get(attribute: string): any {
        return super.get(attribute);
    }

    public has(attribute: string): boolean {
        return super.has(attribute);
    }

    public set(attribute: string | object, value: any, silent?: boolean): this {
        return super.set(attribute, value, silent);
    }

    public remove(attribute): boolean | IDBRequest {
        return super.remove(attribute);
    }
}

export default TestModelObject;
