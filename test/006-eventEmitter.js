"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const eventEmitter_1 = require("./mock/eventEmitter");
describe("event emitter", () => {
    it("emit without listeners", (done) => {
        const event = Symbol("event");
        const test = new eventEmitter_1.default();
        assert.deepEqual(test.listeners(event), []);
        assert.equal(test.removeListener(event), test);
        assert.equal(test.removeAllListeners(event), test);
        assert.ok(!test.emit(event));
        done();
    });
});
//# sourceMappingURL=006-eventEmitter.js.map