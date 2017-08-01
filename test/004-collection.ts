import * as assert from "assert";
import TestCollectionObject from "./mock/collectionObject";
import TestModelObject from "./mock/modelObject";

describe("collection", () => {

    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject});

        assert.ok(test.logger.name.match(loggerName) !== null);
        test.destroy();
        done();
    });

    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName});

        const expected = '{"logger":{"_loggers":{},"_name":"testLogger:TestCollectionObject"},"maxEvents":10,"emitter":{},"collection":{},"proxyCallbacks":{}}';

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("toJSON", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject, idField: "id"});
        const testModel = new TestModelObject({a: "a", b: "b"});

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
    it("events add", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject, idField: "id"});
        const testModel = new TestModelObject({a: "a", b: "b"});

        test.on(TestCollectionObject.events.ADD, (elem) => {
            assert.equal(elem, testModel);
            test.destroy();
            done();
        });

        test.add(testModel);

    });
    it("events add event all", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject, idField: "id"});
        const testModel = new TestModelObject({a: "a", b: "b"});

        test.on(TestCollectionObject.events.ALL, (event, model) => {
            assert.equal(event, TestCollectionObject.events.ADD);
            assert.equal(model, testModel);
            test.destroy();
            done();
        });

        test.add(testModel);

    });
    it("proxy events add", (done) => {
        const loggerName = "testLogger:";
        const test = new TestCollectionObject({loggerName, model: TestModelObject, idField: "id"});
        const testModel = new TestModelObject({a: "a", b: "b"});

        test.add(testModel);
        test.proxyOn(TestModelObject.events.ADD, (model, name, value) => {
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
        const test = new TestCollectionObject({loggerName, model: TestModelObject, idField: "id"});
        const testModel = new TestModelObject({a: "a", b: "b"});

        test.add(testModel);
        test.proxyOn(TestModelObject.events.ALL, (event, model) => {
            assert.equal(event, TestModelObject.events.ADD);
            assert.equal(model, testModel);
            test.destroy();
            done();
        });

        testModel.set("test", "test");

    });

});
