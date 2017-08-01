import * as assert from "assert";
import DfiUtil from "../src/dfiUtil";

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

    it("clone literal", (done) => {
        const original = {
            a: "test",
            b: 1,
            c: {
                a: "test",
                b: 1
            }
        };

        const newcopy = DfiUtil.cloneLiteral(original);
        assert.deepStrictEqual(newcopy, original, "clone differ");
        done();

    });

    it("maybeCallback", (done) => {
        DfiUtil.maybeCallback(() => {
            done();
        }, null);
    });

    it("maybeCallbackOnce", (done) => {
        const callback = () => {
            assert.ok(true);
        };
        DfiUtil.maybeCallbackOnce(callback, null);
        assert.throws(() => {
                DfiUtil.maybeCallbackOnce(callback, null, true);
            }
        );
        done();

    });
});
