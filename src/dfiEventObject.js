"use strict";
const EventEmitter = require("./dfiEventEmitter");
const DfiObject = require("./dfiObject");
class DfiEventObject extends DfiObject {
    constructor(options) {
        super(options);
        this.setProp("emitter", new EventEmitter());
    }
    static get events() {
        return EVENTS;
    }
    get eventNames() {
        return this._ee.eventNames();
    }
    on(event, fn, context) {
        if (event === undefined) {
            throw new Error("undefined event");
        }
        else if (typeof event !== "symbol") {
            this.logger.warn('on event not symbol "%s"', event);
        }
        let ret = this._ee.on(event, fn, context);
        if (this._ee.eventNames(true).length > 10) {
            this.logger.error("memory leak detected: ");
        }
        return ret;
    }
    once(event, fn, context) {
        if (event === undefined) {
            throw new Error("undefined event");
        }
        else if (typeof event !== "symbol") {
            this.logger.warn('once event not symbol "%s"', event);
        }
        let ret = this._ee.once(event, fn, context);
        if (this._ee.eventNames().length > 10) {
            this.logger.error("memory leak detected: ");
        }
        return ret;
    }
    emit(event, ...args) {
        let ret;
        if (event === undefined) {
            throw new Error("undefined event");
        }
        else if (typeof event !== "symbol") {
            this.logger.warn('emit event not symbol "%s"', event);
        }
        if (!this._ee.listeners(event, true) && !this._ee.listeners(DfiEventObject.events.ALL, true)) {
            return false;
        }
        if (this._ee.listeners(DfiEventObject.events.ALL, true)) {
            if (this._ee.listeners(event, true)) {
                this._ee.emit.apply(this._ee, arguments);
            }
            let newArgs = Array.prototype.slice.call(arguments);
            newArgs.unshift(EVENTS.ALL);
            ret = this._ee.emit.apply(this._ee, newArgs);
        }
        else {
            ret = this._ee.emit.apply(this._ee, arguments);
        }
        return ret;
    }
    off(event, fn, context, once) {
        if (event === undefined) {
            throw new Error("undefined event");
        }
        else if (typeof event !== "symbol") {
            this.logger.warn("off event not symbol %s", event);
        }
        if (!this._ee.eventNames(true)) {
            return;
        }
        return this._ee.removeListener(event, fn, context, once);
    }
    removeAllListeners(event) {
        return this._ee.removeAllListeners(event);
    }
    destroy() {
        this.emit(DfiEventObject.events.DESTROY);
        this.removeAllListeners();
        super.destroy();
    }
    get _ee() {
        return this.getProp("emitter");
    }
}
const EVENTS = Object.assign({}, {
    ALL: Symbol(DfiEventObject.prototype.constructor.name + ":all"),
    DESTROY: Symbol(DfiEventObject.prototype.constructor.name + ":destroy")
});
module.exports = DfiEventObject;
//# sourceMappingURL=dfiEventObject.js.map