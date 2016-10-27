import DfiModel = require("../../src/dfiModel");

class TestModelObject extends DfiModel {

    protected static map = new Map([
        ["a", "a"],
        ["b", "b"]
    ]);

    public get(attribute: string): any {
        return super.get(attribute);
    }

    public has(attribute: string): boolean {
        return super.has(attribute);
    }

    public set(attribute: string|Object, value: any, silent?: boolean): this {
        return super.set(attribute, value, silent);
    }

    public remove(attribute): boolean|IDBRequest {
        return super.remove(attribute);
    }
}

export = TestModelObject;
