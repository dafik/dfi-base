"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dfiObject_1 = require("../../src/dfiObject");
class TestObject extends dfiObject_1.default {
    getProp(key) {
        return super.getProp(key);
    }
    setProp(key, value) {
        return super.setProp(key, value);
    }
    hasProp(key) {
        return super.hasProp(key);
    }
    removeProp(key) {
        return super.removeProp(key);
    }
    destroy() {
        return super.destroy();
    }
}
exports.default = TestObject;
//# sourceMappingURL=object.js.map