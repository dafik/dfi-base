"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const dfiUtil_1 = require("../src/dfiUtil");
describe("util", () => {
    it("obj2map", (done) => {
        const obj = { a: "a", b: "b" };
        const z = dfiUtil_1.default.obj2map(obj);
        assert.ok(z instanceof Map);
        assert.equal(z.size, 2);
        assert.ok(z.has("a"));
        assert.ok(z.has("b"));
        assert.equal(z.get("a"), obj.a);
        assert.equal(z.get("b"), obj.b);
        done();
    });
});
//# sourceMappingURL=005-util.js.map