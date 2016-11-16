"use strict";
const DfiModel = require("../../src/dfiModel");
class TestModelObject extends DfiModel {
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
module.exports = TestModelObject;
//# sourceMappingURL=modelObject.js.map