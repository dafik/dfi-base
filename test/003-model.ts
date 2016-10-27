import assert = require("assert");
import TestModelObject = require("./mock/modelObject");

describe("model", () => {

    it("logger name", (done) => {
        let loggerName = "testLogger:";
        let test = new TestModelObject({}, {loggerName});

        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });

    it("toPlain", (done) => {
        let loggerName = "testLogger:";
        let test = new TestModelObject({}, {loggerName});

        let expected = JSON.stringify({
            attr: {},
            prop: {
                logger: {
                    _loggers: {},
                    _name: "testLogger:TestModelObject"
                },
                emitter: {},
                id: "testLogger:2",
                lastUpdate: test.lastUpdate
            }
        });

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("map", (done) => {
        let attrs = {
            a: "a",
            b: "b",
            c: "b"
        }

        let test = new TestModelObject(attrs);
        assert.equal(test.get("a"), attrs.a);
        assert.equal(test.get("b"), attrs.b);
        assert.notEqual(test.get("c"), attrs.c);
        assert.equal(test.get("c"), undefined);

        done();

    });

});
