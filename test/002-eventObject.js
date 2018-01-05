"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const eventObject_1 = require("./mock/eventObject");
describe("event", () => {
    it("logger name", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });
    it("toPlain", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        const expected = '{"prop":{"logger":{"_loggers":{},"_name":"testLogger:TestEventObject"},"maxEvents":10,"emitter":{}}}';
        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });
    it("on", (done) => {
        const event = Symbol("event");
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.emit(event);
        test.on(event, () => {
            assert.ok(true);
        });
        test.on(event, () => {
            assert.ok(true);
        });
        test.on(event, () => {
            test.destroy();
            done();
        });
        const names = test.eventNames;
        assert.equal(names.pop(), "Symbol(event)");
        test.emit(event);
    });
    it("on undefined event", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        assert.throws(() => {
            test.on(undefined, () => {
                test.destroy();
            });
        });
        done();
    });
    it("on no symbol event", (done) => {
        const event = "event";
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.on(event, () => {
            test.destroy();
            done();
        });
        const names = test.eventNames;
        assert.equal(names.pop(), event);
        test.emit(event);
    });
    it("on max events", (done) => {
        const event = Symbol("event");
        const event1 = Symbol("event");
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({
            loggerName,
            maxEvents: 1
        });
        const logger = test.logger;
        test.on(event, () => {
            assert.ok(true);
        });
        test.on(event1, () => {
            assert.ok(true);
        });
        done();
    });
    it("once", (done) => {
        const event = Symbol("event");
        const loggerName = "testLogger:";
        let eventComes = 0;
        const test = new eventObject_1.default({ loggerName });
        // test.once(event);
        test.once(event, () => {
            eventComes++;
        });
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 1);
        done();
    });
    it("once undefined event", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        assert.throws(() => {
            test.once(undefined, () => {
                test.destroy();
            });
        });
        done();
    });
    it("once no symbol event", (done) => {
        const event = "event";
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, () => {
            test.destroy();
            done();
        });
        test.emit(event);
    });
    it("once max events", (done) => {
        const event = Symbol("event");
        const event1 = Symbol("event");
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({
            loggerName,
            maxEvents: 1
        });
        test.once(event, () => {
            assert.ok(true);
        });
        test.once(event1, () => {
            assert.ok(true);
        });
        done();
    });
    it("off", (done) => {
        const event = Symbol("event");
        const loggerName = "testLogger:";
        let eventComes = 0;
        const test = new eventObject_1.default({ loggerName });
        test.off(event);
        test.on(event, () => {
            eventComes++;
        });
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 2);
        test.off(event);
        test.emit(event);
        assert.equal(eventComes, 2);
        done();
    });
    it("off undefined event", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        assert.throws(() => {
            test.off(undefined);
        });
        done();
    });
    it("off no symbol event", (done) => {
        const event = "event";
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, () => {
            assert.ok(true);
        });
        test.off(event);
        done();
    });
    it("removeAllListener", (done) => {
        const event = Symbol("event");
        const loggerName = "testLogger:";
        let eventComes = 0;
        const test = new eventObject_1.default({ loggerName });
        const listener = () => {
            eventComes++;
        };
        test.on(event, listener);
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 2);
        test.off(event, listener, {});
        test.emit(event);
        assert.equal(eventComes, 3);
        test.removeAllListeners(event);
        test.emit(event);
        assert.equal(eventComes, 3);
        done();
    });
    it("removeAllListeners", (done) => {
        const event = Symbol("event");
        const loggerName = "testLogger:";
        let eventComes = 0;
        const test = new eventObject_1.default({ loggerName });
        const listener = () => {
            eventComes++;
        };
        test.on(event, listener);
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 2);
        test.removeAllListeners();
        test.on(event, listener);
        test.emit(event);
        assert.equal(eventComes, 3);
        test.removeAllListeners(event);
        test.emit(event);
        assert.equal(eventComes, 3);
        done();
    });
    it("emit undefined event", (done) => {
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        assert.throws(() => {
            test.emit(undefined);
        });
        done();
    });
    it("emit no symbol event", (done) => {
        const event = "event";
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, () => {
            test.destroy();
            done();
        });
        test.emit(event);
    });
    it("emit on ALL", (done) => {
        const event = Symbol("event");
        const data = "testData";
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, (emitedData) => {
            assert.equal(emitedData, data);
        });
        test.once(eventObject_1.default.events.ALL, (emitedEvent, emitedData) => {
            assert.equal(emitedEvent, event);
            assert.equal(emitedData, data);
            test.destroy();
            done();
        });
        test.emit(event, data);
    });
    it("emit agrs one listener", (done) => {
        const event = Symbol("event");
        const d1 = 1;
        const d2 = 2;
        const d3 = 3;
        const d4 = 4;
        const d5 = 5;
        const d6 = 6;
        const d7 = 7;
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, (e1) => {
            assert.equal(e1, d1);
        });
        test.emit(event, d1);
        test.once(event, (e1, e2) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
        });
        test.emit(event, d1, d2);
        test.once(event, (e1, e2, e3) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
        });
        test.emit(event, d1, d2, d3);
        test.once(event, (e1, e2, e3, e4) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
        });
        test.emit(event, d1, d2, d3, d4);
        test.once(event, (e1, e2, e3, e4, e5) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
            assert.equal(e5, d5);
        });
        test.emit(event, d1, d2, d3, d4, d5);
        test.once(event, (e1, e2, e3, e4, e5, e6) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
            assert.equal(e5, d5);
            assert.equal(e6, d6);
        });
        test.emit(event, d1, d2, d3, d4, d5, d6);
        test.once(event, (e1, e2, e3, e4, e5, e6, e7) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
            assert.equal(e5, d5);
            assert.equal(e6, d6);
            assert.equal(e7, d7);
        });
        test.emit(event, d1, d2, d3, d4, d5, d6, d7);
        done();
    });
    it("emit agrs two listener", (done) => {
        const event = Symbol("event");
        const d1 = 1;
        const d2 = 2;
        const d3 = 3;
        const d4 = 4;
        const loggerName = "testLogger:";
        const test = new eventObject_1.default({ loggerName });
        test.once(event, (e1) => {
            assert.equal(e1, d1);
        });
        test.once(event, (e1) => {
            assert.equal(e1, d1);
        });
        test.once(event, (e1) => {
            assert.equal(e1, d1);
        });
        test.emit(event, d1);
        test.once(event, (e1, e2) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
        });
        test.once(event, (e1, e2) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
        });
        test.emit(event, d1, d2);
        test.once(event, (e1, e2, e3) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
        });
        test.once(event, (e1, e2, e3) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
        });
        test.emit(event, d1, d2, d3);
        test.once(event, (e1, e2, e3, e4) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
        });
        test.once(event, (e1, e2, e3, e4) => {
            assert.equal(e1, d1);
            assert.equal(e2, d2);
            assert.equal(e3, d3);
            assert.equal(e4, d4);
        });
        test.emit(event, d1, d2, d3, d4);
        done();
    });
});
//# sourceMappingURL=002-eventObject.js.map