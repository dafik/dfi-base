import DfiObject from "../../src/dfiObject";
declare class TestObject extends DfiObject {
    getProp(key: any): any;
    setProp(key: any, value: any): DfiObject;
    hasProp(key: any): boolean;
    removeProp(key: any): boolean;
    destroy(): any;
}
export default TestObject;
