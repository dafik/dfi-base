"use strict";
const DfiCollection = require("../../src/dfiCollection");
class TestCollectionObject extends DfiCollection {
    has(element) {
        return super.has(element);
    }
    get(id) {
        return super.get(id);
    }
    add(element) {
        return super.add(element);
    }
    remove(element) {
        return super.remove(element);
    }
    keys() {
        return super.keys();
    }
    clear() {
        return super.clear();
    }
    forEach(fn, thisArg) {
        super.forEach(fn, thisArg);
    }
    toArray() {
        return super.toArray();
    }
    proxyOn(event, fn, context) {
        return super.proxyOn(event, fn, context);
    }
    proxyOff(event, fn, context) {
        super.proxyOff(event, fn, context);
    }
    proxyOffAll() {
        super.proxyOffAll();
    }
}
module.exports = TestCollectionObject;
//# sourceMappingURL=collectionObject.js.map