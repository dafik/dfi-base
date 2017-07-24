import assert = require("assert");
import DfiUtil = require("../src/dfiUtil");

describe("util", () => {

    it("obj2map", (done) => {
        const obj = {a: "a", b: "b"};
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
