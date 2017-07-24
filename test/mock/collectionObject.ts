import DfiCollection = require("../../src/dfiCollection");
import TestModelObject = require("./modelObject");
import {TEventName} from "../../src/dfiInterfaces";

class TestCollectionObject extends DfiCollection<any, TestModelObject> {

    public has(element: any | TestModelObject): boolean {
        return super.has(element);
    }

    public get(id): TestModelObject {
        return super.get(id);
    }

    public add(element: TestModelObject): this {
        return super.add(element);
    }

    public remove(element: any | TestModelObject): boolean {
        return super.remove(element);
    }

    public keys(): any[] {
        return super.keys();
    }

    public clear(): this {
        return super.clear();
    }

    public forEach(fn: (value: TestModelObject, index: any, map: Map<any, TestModelObject>) => void, thisArg?: any): void {
        super.forEach(fn, thisArg);
    }

    public toArray(): TestModelObject[] {
        return super.toArray();
    }

    public proxyOn(event: TEventName, fn: (...args) => void, context?: any): any {
        return super.proxyOn(event, fn, context);
    }

    public proxyOff(event: TEventName, fn: (...args) => void, context?: any): this {
        return super.proxyOff(event, fn, context);
    }

    public proxyOffAll(): this {
        return super.proxyOffAll();
    }
}

export = TestCollectionObject;
