import TestObject = require("./mock/object");
import assert = require("assert");

describe("object", () => {

    it("logger name", (done) => {
        let loggerName = "testLogger:";
        let test = new TestObject({loggerName});

        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });

    it("toPlain", (done) => {
        let loggerName = "testLogger:";
        let test = new TestObject({loggerName});

        let expected = JSON.stringify({
            logger: {
                _loggers: {},
                _name: "testLogger:TestObject"
            }
        });

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("setgetremove", (done) => {
        let key = "testKey";
        let value = "testValue";
        let loggerName = "testLogger:";

        let test = new TestObject({loggerName});
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
