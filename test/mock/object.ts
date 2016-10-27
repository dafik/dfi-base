import DfiObject = require("../../src/dfiObject");

class TestObject extends DfiObject {

    public getProp(key: any): any {
        return super.getProp(key);
    }

    public setProp(key: any, value: any): DfiObject {
        return super.setProp(key, value);
    }

    public hasProp(key): boolean {
        return super.hasProp(key);
    }

    public removeProp(key): boolean {
        return super.removeProp(key);
    }

    public destroy(): any {
        return super.destroy();
    }
}

export = TestObject;
