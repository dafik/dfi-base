"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const modelObject_1 = require("./mock/modelObject");
const collectionObject_1 = require("./mock/collectionObject");
describe("collection", () => {
    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default });
        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });
    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName });
        const expected = '{"logger":{"_loggers":{},"_name":"testLogger:TestCollectionObject"},"maxEvents":10,"emitter":{},"collection":{},"proxyCallbacks":{}}';
        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });
    it("setGetRemove", (done) => {
        const test = new modelObject_1.default({ a: "a", b: "b" });
        const collection = new collectionObject_1.default({ model: modelObject_1.default });
        assert.equal(collection.get(test.id), undefined);
        collection.add(test);
        assert.equal(collection.get(test.id), test);
        collection.remove(test);
        assert.equal(collection.get(test.id), undefined);
        collection.add(test);
        assert.equal(collection.get(test.id), test);
        collection.clear();
        assert.equal(collection.get(test.id), undefined);
        assert.equal(collection.size, 0);
        done();
    });
});
//# sourceMappingURL=004-collection.js.map