"use strict";
const EventEmitter = require("./dfiEventEmitter");
const DfiObject = require("./dfiObject");
class DfiEventObject extends DfiObject {
    constructor(options) {
        super(options);
        this.setProp('emitter', new EventEmitter());
    }
    get _ee() {
        return this.getProp('emitter');
    }
    on(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('on event not symbol "%s"', event);
        }
        var ret = this._ee.on(event, fn, context);
        if (this._ee.eventNames(true).length > 10) {
            this.logger.error('memory leak detected: ');
        }
        return ret;
    }
    get eventNames() {
        return this._ee.eventNames();
    }
    once(event, fn, context) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('once event not symbol "%s"', event);
        }
        var ret = this._ee.once(event, fn, context);
        if (this._ee.eventNames().length > 10) {
            this.logger.error('memory leak detected: ');
        }
        return ret;
    }
    emit(event, ...args) {
        let ret;
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('emit event not symbol "%s"', event);
        }
        if (!this._ee.listeners(event, true) && !this._ee.listeners(DfiEventObject.events.ALL, true))
            return false;
        if (this._ee.listeners(DfiEventObject.events.ALL, true)) {
            if (this._ee.listeners(event, true)) {
                this._ee.emit.apply(this._ee, arguments);
            }
            let args = Array.prototype.slice.call(arguments);
            args.unshift(Events.ALL);
            ret = this._ee.emit.apply(this._ee, args);
        }
        else {
            ret = this._ee.emit.apply(this._ee, arguments);
        }
        return ret;
    }
    off(event, fn, context, once) {
        if (event == undefined) {
            throw new Error('undefined event');
        }
        else if (typeof event != 'symbol') {
            this.logger.warn('off event not symbol "%s"', event);
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
    static get events() {
        return Events;
    }
}
const Events = Object.assign({}, {
    ALL: Symbol(DfiEventObject.prototype.constructor.name + ':all'),
    DESTROY: Symbol(DfiEventObject.prototype.constructor.name + ':destroy')
});
module.exports = DfiEventObject;
//# sourceMappingURL=dfiEventObject.js.map