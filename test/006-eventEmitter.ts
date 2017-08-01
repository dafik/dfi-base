import * as assert from "assert";
import TestEventEmitter from "./mock/eventEmitter";

describe("event emitter", () => {

    it("emit without listeners", (done) => {
        const event = Symbol("event");

        const test = new TestEventEmitter();
        assert.deepEqual(test.listeners(event), []);
        assert.equal(test.removeListener(event), test);
        assert.equal(test.removeAllListeners(event), test);

        assert.ok(!test.emit(event));
        done();
    });
});
