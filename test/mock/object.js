"use strict";
const DfiObject = require("../../src/dfiObject");
class TestObject extends DfiObject {
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
module.exports = TestObject;
//# sourceMappingURL=object.js.map