"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const collectionObject_1 = require("./mock/collectionObject");
const modelObject_1 = require("./mock/modelObject");
describe("collection", () => {
    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default });
        assert.ok(test.logger.name.match(loggerName) !== null);
        test.destroy();
        done();
    });
    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName });
        const expected = '{"prop":{"logger":{"_loggers":{},"_name":"testLogger:TestCollectionObject"},"maxEvents":10,"emitter":{},"collection":{},"proxyCallbacks":{}}';
        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });
    it("toJSON", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default, idField: "id" });
        const testModel = new modelObject_1.default({ a: "a", b: "b" });
        const expected = {
            entries: {},
            size: 0
        };
        assert.deepEqual(test.toJSON(), expected);
        test.add(testModel);
        assert.ok(test.has(testModel));
        const expected1 = {
            entries: {},
            size: 1
        };
        expected1.entries[testModel.id] = {};
        assert.deepEqual(test.toJSON(), expected1);
        assert.deepEqual(test.keys(), [testModel.id]);
        assert.deepEqual(test.toArray(), [testModel]);
        let count = 0;
        test.forEach(() => {
            count++;
        });
        assert.equal(count, 1);
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
    it("events add", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default, idField: "id" });
        const testModel = new modelObject_1.default({ a: "a", b: "b" });
        test.on(collectionObject_1.default.events.ADD, (elem) => {
            assert.equal(elem, testModel);
            test.destroy();
            done();
        });
        test.add(testModel);
    });
    it("events add event all", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default, idField: "id" });
        const testModel = new modelObject_1.default({ a: "a", b: "b" });
        test.on(collectionObject_1.default.events.ALL, (event, model) => {
            assert.equal(event, collectionObject_1.default.events.ADD);
            assert.equal(model, testModel);
            test.destroy();
            done();
        });
        test.add(testModel);
    });
    it("proxy events add", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default, idField: "id" });
        const testModel = new modelObject_1.default({ a: "a", b: "b" });
        test.add(testModel);
        test.proxyOn(modelObject_1.default.events.ADD, (model, name, value) => {
            assert.equal(name, "testAttr");
            assert.equal(value, "testVal");
            assert.equal(model, testModel);
            test.destroy();
            done();
        });
        testModel.set("testAttr", "testVal");
    });
    it("proxy events all", (done) => {
        const loggerName = "testLogger:";
        const test = new collectionObject_1.default({ loggerName, model: modelObject_1.default, idField: "id" });
        const testModel = new modelObject_1.default({ a: "a", b: "b" });
        test.add(testModel);
        test.proxyOn(modelObject_1.default.events.ALL, (event, model) => {
            assert.equal(event, modelObject_1.default.events.ADD);
            assert.equal(model, testModel);
            test.destroy();
            done();
        });
        testModel.set("test", "test");
    });
    it("proxy events all when model removed", (done) => {
        done();
        // TODO implement
    });
});
//# sourceMappingURL=004-collection.js.map