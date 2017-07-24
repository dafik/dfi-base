"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const DfiUtil = require("../src/dfiUtil");
describe("util", () => {
    it("obj2map", (done) => {
        const obj = { a: "a", b: "b" };
        const z = DfiUtil.obj2map(obj);
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