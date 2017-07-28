import DfiCollection from "../../src/dfiCollection";
import TestModelObject from "./modelObject";
import { TEventName } from "../../src/dfiInterfaces";
declare class TestCollectionObject extends DfiCollection<any, TestModelObject> {
    has(element: any | TestModelObject): boolean;
    get(id: any): TestModelObject;
    add(element: TestModelObject): this;
    remove(element: any | TestModelObject): boolean;
    keys(): any[];
    clear(): this;
    forEach(fn: (value: TestModelObject, index: any, map: Map<any, TestModelObject>) => void, thisArg?: any): void;
    toArray(): TestModelObject[];
    proxyOn(event: TEventName, fn: (...args) => void, context?: any): any;
    proxyOff(event: TEventName, fn: (...args) => void, context?: any): this;
    proxyOffAll(): this;
}
export default TestCollectionObject;
