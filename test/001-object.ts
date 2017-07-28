import TestObject from "./mock/object";
import * as assert from "assert";

describe("object", () => {

    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new TestObject({loggerName});

        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });

    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new TestObject({loggerName});

        const expected = JSON.stringify({
            logger: {
                _loggers: {},
                _name: "testLogger:TestObject"
            }
        });

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("setGetRemove", (done) => {
        const key = "testKey";
        const value = "testValue";
        const loggerName = "testLogger:";

        const test = new TestObject({loggerName});
        assert.equal(test.hasProp(key), false);
        assert.equal(test.getProp(key), undefined);

        test.setProp(key, value);
        assert.equal(test.hasProp(key), true);
        assert.equal(test.getProp(key), value);

        test.removeProp(key);
        assert.equal(test.hasProp(key), false);
        assert.equal(test.getProp(key), undefined);

        assert.equal(test.destroyed, undefined);
        test.destroy();
        assert.equal(test.destroyed, true);

        done();
    });

});
