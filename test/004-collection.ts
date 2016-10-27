import assert = require("assert");
import TestModelObject = require("./mock/modelObject");
import TestCollectionObject = require("./mock/collectionObject");

describe("collection", () => {

    it("logger name", (done) => {
        let loggerName = "testLogger:";
        let test = new TestCollectionObject({loggerName, model: TestModelObject});

        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });

    it("toPlain", (done) => {
        let loggerName = "testLogger:";
        let test = new TestCollectionObject({loggerName});

        let expected = JSON.stringify({
            logger: {
                _loggers: {},
                _name: "testLogger:TestCollectionObject"
            },
            emitter: {},
            collection: {},
            proxyCallbacks: {}
        });

        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });

    it("setgetremove", (done) => {

        let test = new TestModelObject({a: "a", b: "b"});
        let colection = new TestCollectionObject({model: TestModelObject});

        assert.equal(colection.get(test.id), undefined);

        colection.add(test);

        assert.equal(colection.get(test.id), test);
        colection.remove(test);

        assert.equal(colection.get(test.id), undefined);

        colection.add(test);
        assert.equal(colection.get(test.id), test);
        colection.clear();

        assert.equal(colection.get(test.id), undefined);
        assert.equal(colection.size, 0);

        done();

    });

});
