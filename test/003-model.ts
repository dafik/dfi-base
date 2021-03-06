import * as assert from "assert";
import TestModelObject from "./mock/modelObject";
import TestModelObject2 from "./mock/modelObject2";

describe("model", () => {
    const attributeName = "testAttribute";
    const attributeValue = "testAttribute";

    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new TestModelObject({}, {loggerName});

        assert.ok(test.logger.name.match(loggerName) !== null);
        test.destroy();
        done();
    });

    it("attr", (done) => {

        const attributes = {id: "someId"};
        const ida = "idAttribute";
        const test = new TestModelObject(attributes);

        test.set(attributeName, attributeValue);
        assert.equal(test.get(attributeName), attributeValue);

        test.set(attributeName, attributeValue);

        test.set(attributes, null);
        test.remove(attributeName);

        const opts = {};
        opts[ida] = attributeName;

        attributes[attributeName] = attributeValue;

        const test2 = new TestModelObject2(attributes, opts);
        assert.equal(test2.get(attributeName), attributeValue);

        test.destroy();
        done();
    });

    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new TestModelObject({}, {loggerName});

        test.set(attributeName, attributeValue);
        assert.equal(test.get(attributeName), attributeValue);

        const expected = {
            attr: {
                testAttribute: "testAttribute"
            },
            prop: {
                emitter: {},
                id: "testLogger:2",
                lastUpdate: test.lastUpdate,
                logger: {
                    _loggers: {},
                    _name: "testLogger:TestModelObject"
                },
                maxEvents: 10
            }
        };
        assert.deepEqual(test.toPlain(), expected);
        done();
    });
    it("toJson", (done) => {
        const loggerName = "testLogger:";
        const test = new TestModelObject({}, {loggerName});

        test.set(attributeName, attributeValue);
        assert.equal(test.get(attributeName), attributeValue);

        const expected = {
            id: "testLogger:3"
        };
        expected[attributeName] = attributeValue;

        assert.deepEqual(test.toJSON(), expected);
        done();
    });

    it("map", (done) => {
        const attrs = {
            a: "a",
            b: "b",
            c: "b"
        };

        const test = new TestModelObject(attrs);
        assert.equal(test.get("a"), attrs.a);
        assert.equal(test.get("b"), attrs.b);
        assert.notEqual(test.get("c"), attrs.c);
        assert.equal(test.get("c"), undefined);

        done();

    });

});
