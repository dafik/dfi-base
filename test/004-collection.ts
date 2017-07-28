import * as assert from "assert";
import TestModelObject from "./mock/modelObject";
import TestCollectionObject from "./mock/collectionObject";

describe("collection", () => {

    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject});

        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });

    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName});

        const expected = '{"logger":{"_loggers":{},"_name":"testLogger:TestCollectionObject"},"maxEvents":10,"emitter":{},"collection":{},"proxyCallbacks":{}}';

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("setGetRemove", (done) => {

        const test = new TestModelObject({a: "a", b: "b"});
        const collection = new TestCollectionObject({model: TestModelObject});

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
