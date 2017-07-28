"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const modelObject_1 = require("./mock/modelObject");
describe("model", () => {
    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new modelObject_1.default({}, { loggerName });
        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });
    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new modelObject_1.default({}, { loggerName });
        const expected = '{"attr":{},"prop":{"logger":{"_loggers":{},"_name":"testLogger:TestModelObject"},"maxEvents":10,"emitter":{},"id":"testLogger:2","lastUpdate":' + test.lastUpdate + "}}";
        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });
    it("map", (done) => {
        const attrs = {
            a: "a",
            b: "b",
            c: "b"
        };
        const test = new modelObject_1.default(attrs);
        assert.equal(test.get("a"), attrs.a);
        assert.equal(test.get("b"), attrs.b);
        assert.notEqual(test.get("c"), attrs.c);
        assert.equal(test.get("c"), undefined);
        done();
    });
});
//# sourceMappingURL=003-model.js.map