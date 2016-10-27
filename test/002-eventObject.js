"use strict";
const TestEventObject = require("./mock/eventObject");
const assert = require("assert");
describe("event", () => {
    it("logger name", (done) => {
        let loggerName = "testLogger:";
        let test = new TestEventObject({ loggerName });
        assert.ok(test.logger.name.match(loggerName) !== null);
        done();
    });
    it("toPlain", (done) => {
        let loggerName = "testLogger:";
        let test = new TestEventObject({ loggerName });
        let expected = JSON.stringify({
            logger: {
                _loggers: {},
                _name: "testLogger:TestEventObject"
            },
            emitter: {},
        });
        assert.equal(JSON.stringify(test.toPlain()), expected);
        done();
    });
    it("on", (done) => {
        let event = Symbol("event");
        let loggerName = "testLogger:";
        let test = new TestEventObject({ loggerName });
        test.on(event, () => {
            done();
        });
        test.emit(event);
    });
    it("once", (done) => {
        let event = Symbol("event");
        let loggerName = "testLogger:";
        let eventComes = 0;
        let test = new TestEventObject({ loggerName });
        test.once(event, () => {
            eventComes++;
        });
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 1);
        done();
    });
    it("off", (done) => {
        let event = Symbol("event");
        let loggerName = "testLogger:";
        let eventComes = 0;
        let test = new TestEventObject({ loggerName });
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
    it("removeAllListeners", (done) => {
        let event = Symbol("event");
        let loggerName = "testLogger:";
        let eventComes = 0;
        let test = new TestEventObject({ loggerName });
        test.on(event, () => {
            eventComes++;
        });
        test.emit(event);
        assert.equal(eventComes, 1);
        test.emit(event);
        assert.equal(eventComes, 2);
        test.removeAllListeners();
        test.emit(event);
        assert.equal(eventComes, 2);
        done();
    });
});
/*

 public on(event: TEventName, fn: Function, context?: any): EventEmitter {
 if (event === undefined) {
 throw new Error("undefined event");
 } else if (typeof event !== "symbol") {
 this.logger.warn('on event not symbol "%s"', event);
 }
 let ret = this._ee.on(event, fn, context);

 if (this._ee.eventNames(true).length > 10) {
 this.logger.error("memory leak detected: ");
 }
 return ret;
 }

 public once(event: TEventName, fn: Function, context?: any): EventEmitter {

 public emit(event: TEventName, ...args): boolean {
 }

 public off(event: TEventName, fn?: Function, context?: any, once?: boolean): EventEmitter {

 if (event === undefined) {
 throw new Error("undefined event");
 } else if (typeof event !== "symbol") {
 this.logger.warn("off event not symbol %s", event);
 }

 if (!this._ee.eventNames(true)) {
 return;
 }

 return this._ee.removeListener(event, fn, context, once);
 }

 public removeAllListeners(event?: string): EventEmitter {
 return this._ee.removeAllListeners(event);
 }*/
//# sourceMappingURL=002-eventObject.js.map