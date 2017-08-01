"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dfiModel_1 = require("../../src/dfiModel");
class TestModelObject2 extends dfiModel_1.default {
    /*   protected static map = new Map([
           ["a", "a"],
           ["b", "b"],
           ["testAttribute", "testAttribute"]
       ]);*/
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
exports.default = TestModelObject2;
//# sourceMappingURL=modelObject2.js.map