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
    it("clone literal", (done) => {
        const original = {
            a: "test",
            b: 1,
            c: {
                a: "test",
                b: 1
            }
        };
        const newcopy = dfiUtil_1.default.cloneLiteral(original);
        assert.deepStrictEqual(newcopy, original, "clone differ");
        done();
    });
    it("maybeCallback", (done) => {
        dfiUtil_1.default.maybeCallback(() => {
            done();
        }, null);
    });
    it("maybeCallbackOnce", (done) => {
        const callback = () => {
            assert.ok(true);
        };
        dfiUtil_1.default.maybeCallbackOnce(callback, null);
        assert.throws(() => {
            dfiUtil_1.default.maybeCallbackOnce(callback, null, true);
        });
        done();
    });
});
//# sourceMappingURL=005-util.js.map