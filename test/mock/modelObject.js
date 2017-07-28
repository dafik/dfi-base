"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dfiModel_1 = require("../../src/dfiModel");
class TestModelObject extends dfiModel_1.default {
    constructor(attributes, options) {
        super(attributes, options);
    }
    get(attribute) {
        return super.get(attribute);
    }
    has(attribute) {
        return super.has(attribute);
    }
    set(attribute, value, silent) {
        return super.set(attribute, value, silent);
    }
    remove(attribute) {
        return super.remove(attribute);
    }
}
TestModelObject.map = new Map([
    ["a", "a"],
    ["b", "b"]
]);
exports.default = TestModelObject;
//# sourceMappingURL=modelObject.js.map